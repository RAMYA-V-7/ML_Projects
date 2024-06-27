from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import cv2
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

models = {
    'fire': YOLO('best_fire.pt'),
    'helmet': YOLO('last.pt')
}
models['fire'].conf = 0.4
models['helmet'].conf = 0.4
terminate_flag = False
detection_data = []

def generate(file_path, model_name):
    global detection_data
    global terminate_flag
    print(f'Opening file: {file_path} with model: {model_name}') 
    model = models[model_name]
    detection_data = []  # Reset detection data
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        print(f'Failed to open video file: {file_path}')  
        return
    
    while cap.isOpened():
        if terminate_flag:
            break
        success, frame = cap.read()
        if success:
            results = model(frame)
            annotated_frame = results[0].plot()
            ret, jpeg = cv2.imencode('.jpg', annotated_frame)
            if not ret:
                break

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')
        else:
            break
    cap.release()


@app.route('/upload', methods=['POST'])
def upload_file():
    global terminate_flag
    terminate_flag = False  
    data = request.form
    
    if 'file' not in data:
        return jsonify({'error': 'No file path provided'}), 400
    
    file = data['file']
    print(f'Received file path: {file}')
    if 'fire' in file:
        model_name = 'fire'
    elif 'helm' in file:
        model_name = 'helmet'
    else:
        return jsonify({'error': 'Unknown model type'}), 400
    
    return jsonify({'file': file, 'model': model_name})


@app.route('/video_feed', methods=['GET'])
def video_feed():
    file = request.args.get('file')
    model_name = request.args.get('model', 'fire')
    
    if not file:
        return jsonify({'error': 'No file path provided'}), 400
    
    return Response(generate(file, model_name),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detection_data', methods=['GET'])
def get_detection_data():
    global detection_data
    return jsonify(detection_data)

@app.route('/stop', methods=['POST'])
def stop():
    global terminate_flag
    terminate_flag = True
    return "Process has been Terminated"

if __name__ == '__main__':
    app.run(debug=True)
