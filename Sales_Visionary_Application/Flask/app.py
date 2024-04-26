from flask import Flask, Blueprint, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api
import json
from endpoints import project_api_routes

def create_app():
    web_app = Flask(__name__)  # Initialize Flask App
    CORS(web_app)
    api1 = Api(web_app)
    class Actual(Resource):
         def get(self):
             f1=open(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/ActualValueBeforeTraining.json')
             data1=json.load(f1)
             return data1
    class Predicted(Resource):
        def get(self):
             f2=open(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/PredictedValueAfterTraining.json')
             data2=json.load(f2)
             return data2
    class ActualUptoDate(Resource):
        def get(self):
             f3=open(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/ActualValueOfSalesDataUptoDate.json')
             data3=json.load(f3)
             return data3
    class Forecasted(Resource):
        def get(self):
             f4=open(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/ForecastedValueOfSalesData.json')
             data4=json.load(f4)
             return data4
    class Metrics(Resource):
        def get(self):
             f5=open(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/metrics.json')
             data5=json.load(f5)
             return data5
    class LoginInfo(Resource):
        def get(self):
            f6=open(r'C:/Users/91984/ANGULARDIGI/proj1/Flask/login.json')
            data6=json.load(f6)
            return data6
    #rest api routing maps
    api1.add_resource(Actual, '/actual') # Route_1
    api1.add_resource(Predicted, '/predicted') # Route_2
    api1.add_resource(ActualUptoDate, '/actualuptodate') # Route_3
    api1.add_resource(Forecasted, '/forecasted') # Route_4
    api1.add_resource(Metrics, '/metrics') # Route_5
    api1.add_resource(LoginInfo, '/loginInfo')# Route_6
    api_blueprint = Blueprint('api_blueprint', __name__)
    api_blueprint = project_api_routes(api_blueprint)

    web_app.register_blueprint(api_blueprint, url_prefix='/api')    

    return web_app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0",debug=True)
