# Backend to eod-modeler

API_TOKEN = '61b683cf41fe95.81382122'

import urllib
import pandas as pd
import threading

import asyncio 

from sqlalchemy import create_engine

from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
import numpy as np

from numpy.polynomial import Polynomial

from flask import Flask
from flask_cors import CORS

class Server(object):
  def __init__(self):
    """initialize server"""
    self.engine = create_engine('sqlite:///eod.db', echo=False)
    self.conn = self.engine.connect()


    self.dfs = {}

    self.symbols = ['NASDX', 'VASGX', 'BITCF', 'RRGB', 'OGHCX']
    self.readDataFromDB()

  def readDataFromDB(self):
    for symbol in self.symbols:
      try:
        table = self.engine.execute(f'SELECT * FROM {symbol}').fetchall()
        if len(table) > 0:
          self.dfs[symbol] = pd.read_sql_table(symbol, self.conn)
      except:
        print(f'{symbol} not found in database')
      print(self.dfs[symbol])

  async def getData(self):
    """asynchronous function to fetch data"""
    today = str(pd.to_datetime('today', format='%Y-%m-%d')).split(' ')[0]
    yearAgo = str(pd.to_datetime('today') - pd.tseries.offsets.DateOffset(months=6)).split(' ')[0]
    for symbol in self.symbols:
      latest = 'X'
      try:
        latest = self.engine.execute(f'SELECT max(date) FROM {symbol}').fetchall().pop()
      except:
        pass
      if str(latest) == today:
        self.dfs[symbol] = self.dfs[symbol].iloc[0:len(self.dfs[symbol]-7)]
        continue
      url = f'https://eodhistoricaldata.com/api/eod/{symbol}.US?from={yearAgo}&to={today}&period=d&fmt=json&api_token={API_TOKEN}'
      
      try:
        self.dfs[symbol] = pd.read_json(url)
        try:
          self.engine.execute(f'DROP TABLE {symbol}')
        finally: 
          self.dfs[symbol].to_sql(symbol, self.engine)
      except:
        pass
    
    try:
      self.forecast()
    except:
      print("forecast failed")
      
  def runGetData(self):
    """run asynchronous function to fetch data"""
    self.future = asyncio.run(self.getData())

  def runGetDataService(self):
    """Run service to continually update data"""
    try:
      self.runGetData()
    finally:
      t = threading.Timer(60*60*24, self.runGetDataService)
      t.start()

  def forecast(self):
    """forecasts each symbol's performance"""
    self.readDataFromDB()
    for symbol in self.symbols:
      df = pd.DataFrame()
      dates = []
      
      dates.append(str(pd.to_datetime(self.dfs[symbol]['date'][len(self.dfs[symbol]['date'])-1]) + pd.tseries.offsets.DateOffset(days=1)).split(' ')[0])
      
      for i in range(6):
        dates.append(str(pd.to_datetime(dates[i]) + pd.tseries.offsets.DateOffset(days=1)).split(' ')[0])
      print(dates)
      df['date'] = dates
      for column in self.dfs[symbol].columns:
        forecast = []
        if column == 'date' or column == 'index':
          continue
        model = Pipeline([('poly', PolynomialFeatures(degree=3)),('linear', LinearRegression(fit_intercept=False))])
        
        model = model.fit(X=np.array(range(len(self.dfs[symbol][column]))).reshape(-1,1),y=self.dfs[symbol][column])
        
        p = Polynomial(model.named_steps['linear'].coef_)
        for i in range(7):
          forecast.append(p(len(self.dfs)+i))
        df[column] = forecast
      self.dfs[symbol] = self.dfs[symbol].append(df, ignore_index=True)

    
s = Server()

s.runGetDataService()

app = Flask(__name__)
cors = CORS(app, resources={r"/symbol/*": {"origins": "*"}})

@app.route('/symbol/<symbol>')
def get_symbol(symbol):
  """provides json for symbol"""
  return s.dfs[symbol].to_json()

app.run(port=5000)