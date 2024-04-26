import logging
import math
from json2html import *
from flask import request
from flask_restful import Resource,Api
from flask_pymongo import pymongo
from flask import jsonify, request,render_template
import pandas as pd
import numpy as np
import matplotlib.pylab as plt
from flask_cors import cross_origin
from matplotlib.pylab import rcParams
from datetime import datetime
from scalecast.Forecaster import Forecaster
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose
import pandas_datareader as pdr
import csv
import json
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_squared_error
from statsmodels.tools.eval_measures import rmse
from sklearn.metrics import mean_absolute_error
from statsmodels.tsa.stattools import adfuller
from pmdarima import auto_arima
import warnings
warnings.filterwarnings('ignore')

# MongoDb Connection
con_string = "mongodb+srv://ramya:ramya@cluster0.mzymasp.mongodb.net/?retryWrites=true&w=majority"
client = pymongo.MongoClient(con_string)
db = client.get_database('login')
user_collection = pymongo.collection.Collection(db, 'loginInfo') #(<database_name>,"<collection_name>")
print("MongoDB connected Successfully")

varlist=[]
emailId=[]
password1=[]
login=[]
def project_api_routes(endpoints):
    


    @endpoints.route('/not',methods=['GET'])
    def home():
          return render_template("index.html")
    
    @endpoints.route('/Choice',methods=['GET','POST'])
    def getNoOfChoice():
        resp = {}
        try:
            req1=request.json #json obj
            print(req1)
            #Converting to python object
            #loads - used to parse a valid JSON string and convert it into a Python Dictionary.
            #dumps - objects are required to be in string or number format
            python_obj = json.loads(json.dumps(req1))
            print(python_obj["choice"])
            p=python_obj["period"]
            c=python_obj["choice"]
            #list for appending period and choice of forecasting
            varlist.append(p)
            varlist.append(c)
            # if(c=="Week"):
            #     print(c,"ANDDDDDDDDDDDDDDDDDDDD",p)
            #     print(type(p)==int)
            # print(varlist)
            status = {
                "statusCode":"200",
                "statusMessage":"Choice Uploaded Successfully."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp
            
    @endpoints.route('/loginInfo',methods=['POST'])
    def loginInfo():
        resp = {}
        try:
            req=request.json
            print("Login Information...............")
                 
            #Converting to python object
            #loads - used to parse a valid JSON string and convert it into a Python Dictionary.
            #dumps - objects are required to be in string or number format
            python_obj_1 = json.loads(json.dumps(req))
            print(python_obj_1["emailId"],python_obj_1["password"])
            email=python_obj_1["emailId"]
            password=python_obj_1["password"]
            user_collection.insert_one(req) 
            emailId.append(email)
            password1.append(password)
            login={'EmailId':emailId,'Password':password1}
            loginDataFrame=pd.DataFrame(login)
            loginDataFrame.to_csv(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/login.csv')
            csv_to_json(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/login.csv',r'C:/Users/91984/ANGULARDIGI/proj1/Flask/login.json')
            status = {
                "statusCode":"200",
                "statusMessage":"Login information uploaded in database successfully."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp
            
    # @endpoints.route('/readLoginInfo',methods=['GET'])
    # def readLoginInfo():
    #     resp = {}
    #     try:
    #         users = user_collection.find({})
    #         print(users)
    #         users = list(users)
    #         status = {
    #             "statusCode":"200",
    #             "statusMessage":"User Data Retrieved Successfully from the Database."
    #         }
    #         output = [{'Email Id' : user['emailId'], 'Password' : user['password']} for user in users]   #list comprehension
    #         resp['data'] = output
    #     except Exception as e:
    #         print(e)
    #         status = {
    #             "statusCode":"400",
    #             "statusMessage":str(e)
    #         }
    #     resp["status"] =status
    #     return resp

            
    @endpoints.route('/fileupload',methods=['POST'])
    def file_upload():
        resp = {}
        try:
            
            req=request.form.to_dict() 
            file=request.files.get('file')
            
            ml(file)
           
            status = {
                "statusCode":"200",
                "statusMessage":"File uploaded Successfully."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp
    
    @endpoints.route('/fileupload',methods=['POST'])
    def csv_to_json(csvFilePath, jsonFilePath):
            jsonArray = []
            with open(csvFilePath, encoding='utf-8') as csvf: 
                #DictReader -  maps the information read into a dictionary.
              csvReader = csv.DictReader(csvf) 
              for row in csvReader: 
              #add this python dict to json array
               jsonArray.append(row)
               with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
                  jsonString = json.dumps(jsonArray, indent=4)
                  jsonf.write(jsonString)
    
    
    @endpoints.route('/ml',methods=['GET','POST'])
    def ml(file):
        resp = {}
        try:
            
            data = pd.read_csv(file,index_col ='Date',parse_dates = True)
            # data.columns['Date']
            print(data.head)
            
            # ETS Decomposition - focuses on trend and seasonal components.
            #breaking down of the series into its trend, seasonality and noise components. It helps in understanding the time series data better while using it to analyze and forecast.
            #The additive model is Y[t] = T[t] + S[t] + e[t]
            #The multiplicative model is Y[t] = T[t] * S[t] * e[t]
            #The results are obtained by first estimating the trend by applying a convolution filter to the data.
            #The trend is then removed from the series and the average of this de-trended series for each period is the returned seasonal component.
            result = seasonal_decompose(data['Sales'], model ='multiplicative')
            result.plot()
            plt.get_current_fig_manager().window.state('zoomed')
            plt.show()
            #can take place parallel or step wise 
            #auto_arima - optimal order and the optimal seasonal order , its the best model to a single variable (univariable) time series.
            stepwise_fit = auto_arima(data['Sales'], start_p = 1, start_q = 1,
                          max_p = 3, max_q = 3, m = 12,#m==1 - non seasonal
                          start_P = 0, seasonal = True,
                          d = None, D = 2, trace = True,
                          error_action ='ignore',    #we don't want to know if an order does not work
                          suppress_warnings = True,  #we don't want convergence warnings
                          stepwise = True)           #set to stepwise
            
            print("Step wise fit summary :")
            print(stepwise_fit.summary())
            
            #Split data into train / test sets
            train = data.iloc[:len(data)-12]
            test = data.iloc[len(data)-12:] #Set one year(12 months) for testing
            
            model = SARIMAX(train['Sales'],
                order = (2,0,0), 
                seasonal_order =(2,2,0,12))
            
            print("Modal Fit Summary :")
            result = model.fit()
            print(result.summary())
            
            
            print("Predictions of ARIMA Model against the test set")
            start = len(train)
            end = len(train) + len(test) - 1
            
            # Predictions for one-year against the test set
            predictions = result.predict(start, end,typ = 'levels').rename("Predictions")
            # plot predictions and actual values
            predictions.plot(legend = True,color="green")
            test['Sales'].plot(legend = True,color="red")
            plt.get_current_fig_manager().window.state('zoomed')
            plt.show()
            
            
            # Predictions for specified period
            model = model = SARIMAX(data['Sales'], 
                        order = (2, 0, 0), 
                        seasonal_order =(2, 2, 0, 12))
            result = model.fit()
            
            
            if(varlist[1]=="Week"):#Converting Week To Year - 1/52 = 0.019165
                b=varlist[0]/52
                b1=(int(b))
                forecast = result.predict(start = len(data), end = (len(data)-1) + b1*12,typ = 'levels').rename('Forecast')
            elif(varlist[1]=="Month"):#Converting Month To Year - 1/12 = 0.0833334
                a=varlist[0]/12
                a1=(int(a))
                forecast = result.predict(start = len(data), end = (len(data)-1) + a1*12,typ = 'levels').rename('Forecast')
            elif(varlist[1]=="Year"):
                forecast = result.predict(start = len(data), end = (len(data)-1) + varlist[0]*12,typ = 'levels').rename('Forecast')
            # print(period,choice)


            #Plot the forecast values
            data['Sales'].plot(legend = True,color="Purple")
            forecast.plot(legend = True,color="Red")
            plt.get_current_fig_manager().window.state('zoomed')
            plt.show()
            
            #METRICS..................
            print("RMSE Value Of Predicted Test Sales Data:")
            rmse1=rmse(test['Sales'], predictions)
            print(rmse1)#root mean squared error
            
            print("MSE Value Of Predicted Test Sales Data:")
            mse=mean_squared_error(test["Sales"], predictions)
            print(mse)#mean squared error
            print("ACCURACY-RMSE")
            print(math.sqrt(mse))
            print("MAE - Mean Absolute Error :")
            mae = mean_absolute_error(test,predictions)
            print(mae)
            
            #Perform Dickey–Fuller test:
            print('Results of Dickey Fuller Test:')
            datatest = adfuller(data['Sales'], autolag='AIC')
            dfoutput = pd.Series(datatest[0:4], index=['Test Statistic','p-value','#Lags Used','Number of Observations Used'])
            for key,value in datatest[4].items():
             dfoutput['Critical Value (%s)'%key] = value
             print(dfoutput)
            
            #From the above ADCF Test , We have p=0.9 - data is NON STATIONARY
            #Performimg data transformation - log transformation & remove the trend component to make data(series) - STATIONARY
            data_log = np.log(data)
            plt.plot(data_log)
            
            rollmean_log = data_log.rolling(window=12).mean()
          
            data_new = data_log - rollmean_log
            print("New data head with Null values")
            print(data_new)
            
            print("Removing null values :")
            data_new.dropna(inplace=True)
            print(data_new)
            
            
            #After performing Log Transformation , Performing ADCF Test - To check stationarity
            print('Results of Dickey Fuller Test after LOG TRANSFORMATION:')
            datatest1 = adfuller(data_new['Sales'], autolag='AIC')
            dfoutput1 = pd.Series(datatest1[0:4], index=['Test Statistic','p-value','#Lags Used','Number of Observations Used'])
            ts=datatest1[0]
            p=datatest1[1]
            lag=datatest1[2]
            obs=datatest1[3]
            print("Test Statistic :",datatest1[0])
            print("p-value :",datatest1[1])
            print("Lags Used",datatest1[2])
            print("Number of Observations Used",datatest1[3])
            for key1,value1 in datatest1[4].items():
                dfoutput1['Critical Value (%s)'%key1] = value1
                print(dfoutput1)
            
            
            #List Creation Foe Metrics Header
            metricsData=[]
            metricsData.append("RMSE")#measure the efficiency of the model - should be less than 180
            metricsData.append("MSE")#measures the average squared difference between the estimated values and true value
            metricsData.append("MAE")#measures the absolute value of the difference between the forecasted value and the actual value.
            metricsData.append("Test Satistic")
            metricsData.append("P-Value")
            metricsData.append("Lag")
            metricsData.append("Observation Used")
            print(metricsData)
            #List Creation For Metrics Value
            metricsValue=[]
            metricsValue.append(rmse1)
            metricsValue.append(mse)
            metricsValue.append(mae)
            metricsValue.append(ts)
            metricsValue.append(p)
            metricsValue.append(lag)
            metricsValue.append(obs)
            print(metricsValue)
            #Dictionary for Metrics - To convert them as csv
            metricsDict={'MetricsName':metricsData,'MetricsValue':metricsValue}
            metricDataFrame=pd.DataFrame(metricsDict)
            metricDataFrame.to_csv(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/metrics.csv')
            csv_to_json(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/metrics.csv',r'C:/Users/91984/ANGULARDIGI/proj1/Flask/metrics.json')
            
            
            print(".....................................................")
            print("Actual Values Vs Predicted Test Set Values......")
            print("Actual Values Of Sales Data Before Training : ")
            print(predictions)
            predictions.to_csv(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/ActualValueBeforeTraining.csv',header=None)
            predictions = pd.read_csv(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/ActualValueBeforeTraining.csv', header=None)
            predictions.to_csv(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/ActualValueBeforeTraining.csv', header=["Date","Sales"], index=False)
            csv_to_json(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/ActualValueBeforeTraining.csv',r'C:/Users/91984/ANGULARDIGI/proj1/Flask/ActualValueBeforeTraining.json')
            
            
            print(".....................................................")
            print("Predicted Test Values Of Sales Data After Training : ")
            print(test)
            test.to_csv(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/PredictedValueAfterTraining.csv')
            csv_to_json(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/PredictedValueAfterTraining.csv',r'C:/Users/91984/ANGULARDIGI/proj1/Flask/PredictedValueAfterTraining.json')
            

            print("Actual Values Vs Forecasted Values......")
            print("Actual Values Of Sales Data Upto data : ")
            print(data)
            data.to_csv(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/ActualValueOfSalesDataUptoDate.csv')
            csv_to_json(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/ActualValueOfSalesDataUptoDate.csv',r'C:/Users/91984/ANGULARDIGI/proj1/Flask/ActualValueOfSalesDataUptoDate.json')
            
            print(".....................................................")
            print("Forecasted Value Of Sales Data :")
            print(forecast)
            forecast.to_csv(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/ForecastedValueOfSalesData.csv',header=None)
            forecast=pd.read_csv(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/ForecastedValueOfSalesData.csv',header=None)
            forecast.to_csv(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/ForecastedValueOfSalesData.csv',header=["Date","Forecast"],index=False)
            csv_to_json(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/templates/ForecastedValueOfSalesData.csv',r'C:/Users/91984/ANGULARDIGI/proj1/Flask/ForecastedValueOfSalesData.json')
            
            status = {
                "statusCode":"200",
                "statusMessage":"File uploaded Successfully."
            }
        except Exception as e:
            print(e)
            status = {
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] =status
        return resp
    
    
    
    return endpoints
'''
import pandas as pd
import numpy as np
import matplotlib.pylab as plt
from matplotlib.pylab import rcParams
from datetime import datetime
from scalecast.Forecaster import Forecaster
import pandas_datareader as pdr
import warnings
warnings.filterwarnings('ignore')
data=pd.read_csv(r'C:/Users/91984/ANGULARDIGI/Deploy/AirPassengers.csv')# LOADING DATASET
data.shape #SIZE OF THE FILE -144 unique Values and 2 columns - (144,2)
data['Month']=pd.to_datetime(data['Month'], infer_datetime_format=True)#CONVERTING (Month)IT AS DATE FORMAT
data=data.set_index(['Month'])
# print(data.head())
# print(data.tail())
plt.figure(figsize=(20,10))
plt.xlabel("Month")
plt.ylabel("Number of Air Passengers")
plt.plot(data,color='Blue',linewidth=5, marker='D',markersize=12, linestyle='solid',alpha=0.8)
#STATIONARITY - using differencing (Integration) - Calculating Rolling Mean and Standard Deviation
rolmean=data.rolling(window=12).mean()
rolstd=data.rolling(window=12).std()
# print(rolmean.head(15))
# print(rolstd.head(15))
plt.figure(figsize=(20,10))
actual=plt.plot(data, color='red', label='Actual')
mean_6=plt.plot(rolmean, color='green', label='Rolling Mean') 
std_6=plt.plot(rolstd, color='black', label='Rolling Std')
plt.legend(loc='best')
plt.title('Rolling Mean & Standard Deviation')

#ADF Test - augmented Dickey–Fuller test  - To check Stationarity -p-value <= 0.05: Reject the null hypothesis (H0), the data does not have a unit root and is stationary.
from statsmodels.tsa.stattools import adfuller
print('Dickey-Fuller Test: ')
datatest1=adfuller(data['#Passengers'], autolag='AIC')
dfoutput=pd.Series(datatest1[0:4], index=['Test Statistic','p-value','Lags Used','No. of Obs'])
for key,value in datatest1[4].items():
    dfoutput['Critical Value (%s)'%key] = value


plt.figure(figsize=(20,10))
data_log=np.log(data)
plt.plot(data_log)
# plt.show()

plt.figure(figsize=(20,10))
MAvg=data_log.rolling(window=12).mean()
MStd=data_log.rolling(window=12).std()
plt.plot(data_log)
plt.plot(MAvg, color='Purple')
# plt.show()

data_log_diff=data_log-MAvg
data_log_diff.head(12)

data_log_diff=data_log_diff.dropna()
# print(data_log_diff.head())

def stationarity(timeseries):
    
    rolmean=timeseries.rolling(window=12).mean()
    rolstd=timeseries.rolling(window=12).std()
    
    plt.figure(figsize=(20,10))
    actual=plt.plot(timeseries, color='red', label='Actual')
    mean_6=plt.plot(rolmean, color='green', label='Rolling Mean') 
    std_6=plt.plot(rolstd, color='black', label='Rolling Std')
    plt.legend(loc='best')
    plt.title('Rolling Mean & Standard Deviation')
    plt.show()
    print('Dickey-Fuller Test: ')
    datatest1=adfuller(timeseries['#Passengers'], autolag='AIC')
    dfoutput=pd.Series(datatest1[0:4], index=['Test Statistic','p-value','Lags Used','No. of Obs'])
    for key,value in datatest1[4].items():
        dfoutput['Critical Value (%s)'%key] = value
    print(dfoutput)
   
   
# stationarity(data_log_diff)

plt.figure(figsize=(20,10))
exp_data=data_log.ewm(halflife=12, min_periods=0, adjust=True).mean()
plt.plot(data_log)
plt.plot(exp_data, color='green')
# plt.show()

exp_data_diff=data_log-exp_data
# stationarity(exp_data_diff)

plt.figure(figsize=(20,10))
data_shift=data_log-data_log.shift()
plt.plot(data_shift)
#plt.show()

data_shift=data_shift.dropna()
# stationarity(data_shift)

from statsmodels.tsa.seasonal import seasonal_decompose
decomp=seasonal_decompose(data_log)

trend=decomp.trend
seasonal=decomp.seasonal
residual=decomp.resid

plt.subplot(411)
plt.plot(data_log, label='Original')
plt.legend(loc='best')
plt.subplot(412)
plt.plot(trend, label='Trend')
plt.legend(loc='best')
plt.subplot(413)
plt.plot(seasonal, label='Seasonality')
plt.legend(loc='best')
plt.subplot(414)
plt.plot(residual, label='Residuals')
plt.legend(loc='best')
plt.tight_layout()
# plt.show()

decomp_data=residual
decomp_data=decomp_data.dropna()
#stationarity(decomp_data)

from statsmodels.tsa.stattools import acf, pacf

lag_acf=acf(data_shift, nlags=20)
lag_pacf=pacf(data_shift, nlags=20, method='ols')

plt.figure(figsize=(20,10))
plt.subplot(121)
plt.plot(lag_acf)
plt.axhline(y=0,linestyle='--',color='green')
plt.axhline(y=-1.96/np.sqrt(len(data_shift)),linestyle='--',color='yellow')
plt.axhline(y=1.96/np.sqrt(len(data_shift)),linestyle='--',color='blue')
plt.title('Autocorrelation Function')
#plt.show()

plt.subplot(122)
plt.plot(lag_pacf)
plt.axhline(y=0,linestyle='--',color='green')
plt.axhline(y=-1.96/np.sqrt(len(data_shift)),linestyle='--',color='pink')
plt.axhline(y=1.96/np.sqrt(len(data_shift)),linestyle='--',color='violet')
plt.title('Partial Autocorrelation Function')
#plt.show()

from statsmodels.tsa.arima_model import ARIMA

plt.figure(figsize=(20,10))
model=ARIMA(data_log, order=(2,1,2))
results=model.fit(disp=-1)
plt.plot(data_shift)
plt.plot(results.fittedvalues, color='red')
plt.title('RSS: %.4f'% sum((results.fittedvalues-data_shift['#Passengers'])**2))
print('plotting ARIMA model')
#plt.show()

predictions=pd.Series(results.fittedvalues, copy=True)
#print(predictions.head())

predictions_cum_sum=predictions.cumsum()
# print(predictions_cum_sum.head())

predictions_log=pd.Series(data_log['#Passengers'].iloc[0], index=data_log.index)
predictions_log=predictions_log.add(predictions_cum_sum,fill_value=0)
predictions_log.head()

predictions_ARIMA=np.exp(predictions_log)
plt.figure(figsize=(20,10))
plt.plot(data)
plt.plot(predictions_ARIMA)
# plt.show()

rcParams['figure.figsize']=20,10
results.plot_predict(1,300)
x=results.forecast(steps=249)
plt.show()

'''