import ExpoModulesCore
import Vision

public class ExpoIosImageToTextModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoIosImageToText")

    AsyncFunction("getTextFromImage") { (path: String, promise: Promise) in
      // Get the data and try and get the image
      guard let url = URL(string: path), let data = try? Data(contentsOf: url), let cgImage = UIImage(data: data)?.cgImage else {
        promise.resolve(nil)
        return
      }

      // Create the handler
      func recognizeTextHandler(request: VNRequest, error: Error?) {
        guard let observations = request.results as? [VNRecognizedTextObservation] else {
          promise.resolve(nil)
          return
        }

        let recognizedStrings = observations.compactMap { observation in
          return observation.topCandidates(1).first?.string
        }

        promise.resolve(recognizedStrings)
      }

      // Create the request
      let requestHandler = VNImageRequestHandler(cgImage: cgImage)
      let request = VNRecognizeTextRequest(completionHandler: recognizeTextHandler)
      request.recognitionLevel = .accurate
      request.usesLanguageCorrection = true

      do {
        try requestHandler.perform([request])
      } catch {
        promise.resolve(nil)
      }
    }
  }
}
