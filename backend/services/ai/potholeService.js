/**
 * Pothole AI Service
 * In mock mode: generates realistic pothole AI detection output
 * In real mode: would invoke PyTorch / YOLOv8 / ONNX inference pipeline
 */
async function analyzePothole(imageInput, metadata = {}) {
  const confidence = +(0.91 + Math.random() * 0.08).toFixed(3);
  const widthCm = Math.floor(35 + Math.random() * 30);
  const lengthCm = Math.floor(40 + Math.random() * 35);
  const depthCm = Math.floor(8 + Math.random() * 10);
  
  const severity = depthCm > 12 ? 'HIGH' : (depthCm > 6 ? 'MEDIUM' : 'LOW');
  
  return {
    feature: 'POTHOLE',
    type: 'Pothole',
    category: 'ROAD_DEFECT',
    confidence,
    severity,
    boundingBox: {
      x: +(0.15 + Math.random() * 0.4).toFixed(2),
      y: +(0.4 + Math.random() * 0.3).toFixed(2),
      width: +(0.2 + Math.random() * 0.2).toFixed(2),
      height: +(0.15 + Math.random() * 0.15).toFixed(2)
    },
    metadata: {
      craterWidthCm: widthCm,
      craterLengthCm: lengthCm,
      depthCm: depthCm,
      riskFactor: severity === 'HIGH' ? 'High risk for 2-wheelers' : 'Moderate transit impact',
      aiModel: 'YOLOv8-Pothole-Edge-v2.4'
    },
    description: `Pothole detected (${widthCm}cm x ${lengthCm}cm, depth ${depthCm}cm) on bus corridor. Confidence: ${(confidence * 100).toFixed(1)}%.`
  };
}

module.exports = {
  analyzePothole
};
