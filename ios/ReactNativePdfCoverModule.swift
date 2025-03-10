import ExpoModulesCore
import PDFKit

public class ReactNativePdfCoverModule: Module {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ReactNativePdfCover')` in JavaScript.
        Name("ReactNativePdfCover")
        
        // Modify PDF thumbnail generation function with optional parameters
        AsyncFunction("getPdfCover") { (path: String, password: String?, page: Int, width: Double?, height: Double?, scale: Double?) -> [String: Any] in
            // Decode file path
            guard let pdfURL = URL(string: path) else {
                throw NSError(domain: "ReactNativePdfCover", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid PDF path"])
            }
            
            // Create PDF document
            guard let pdfDocument = PDFDocument(url: pdfURL) else {
                throw NSError(domain: "ReactNativePdfCover", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to load PDF"])
            }
            
            // Handle password protection
            if pdfDocument.isLocked && password != nil {
                pdfDocument.unlock(withPassword: password!)
            }
            
            if pdfDocument.isLocked {
                throw NSError(domain: "ReactNativePdfCover", code: -1, userInfo: [NSLocalizedDescriptionKey: "Password required or incorrect password"])
            }
            
            // Get page
            let pageNumber = max(1, min(page, pdfDocument.pageCount))
            guard let pdfPage = pdfDocument.page(at: pageNumber - 1) else {
                throw NSError(domain: "ReactNativePdfCover", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to get page from PDF"])
            }
            
            // Calculate scale
            let pageRect = pdfPage.bounds(for: .mediaBox)
            let finalScale: CGFloat
            
            if let scaleValue = scale {
                finalScale = CGFloat(scaleValue)
            } else if let width = width, let height = height, width > 0, height > 0 {
                let scaleX = CGFloat(width) / pageRect.width
                let scaleY = CGFloat(height) / pageRect.height
                finalScale = min(scaleX, scaleY)
            } else {
                finalScale = 1.0
            }
            
            // Create thumbnail
            let contextSize = CGSize(
                width: pageRect.width * finalScale,
                height: pageRect.height * finalScale
            )
            
            UIGraphicsBeginImageContextWithOptions(contextSize, false, 0.0)
            guard let context = UIGraphicsGetCurrentContext() else {
                throw NSError(domain: "ReactNativePdfCover", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to create graphics context"])
            }
            
            // White background
            context.setFillColor(UIColor.white.cgColor)
            context.fill(CGRect(origin: .zero, size: contextSize))
            
            // Draw PDF page
            context.scaleBy(x: finalScale, y: finalScale)
            pdfPage.draw(with: .mediaBox, to: context)
            
            // Get image
            guard let image = UIGraphicsGetImageFromCurrentImageContext(),
                  let imageData = image.pngData() else {
                UIGraphicsEndImageContext()
                throw NSError(domain: "ReactNativePdfCover", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to create image"])
            }
            
            UIGraphicsEndImageContext()
            
            // Return result object
            return [
                "cover": imageData.base64EncodedString(),
                "page": pageNumber,
                "size": [
                    "width": contextSize.width,
                    "height": contextSize.height
                ],
                "pageCount": pdfDocument.pageCount
            ]
        }
        
        // Modify function to get all PDF page thumbnails
        AsyncFunction("getPdfCoverList") { (path: String, password: String?, scale: Double) -> [[String: Any]] in
            // Decode file path
            guard let pdfURL = URL(string: path) else {
                throw NSError(domain: "ReactNativePdfCover", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid PDF path"])
            }
            
            // Create PDF document
            guard let pdfDocument = PDFDocument(url: pdfURL) else {
                throw NSError(domain: "ReactNativePdfCover", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to load PDF"])
            }
            
            // Handle password protection
            if pdfDocument.isLocked && password != nil {
                pdfDocument.unlock(withPassword: password!)
            }
            
            if pdfDocument.isLocked {
                throw NSError(domain: "ReactNativePdfCover", code: -1, userInfo: [NSLocalizedDescriptionKey: "Password required or incorrect password"])
            }
            
            var coverList: [[String: Any]] = []
            let finalScale = CGFloat(scale)
            
            // Iterate through all pages
            for pageIndex in 0..<pdfDocument.pageCount {
                guard let pdfPage = pdfDocument.page(at: pageIndex) else { continue }
                
                // Get page size
                let pageRect = pdfPage.bounds(for: .mediaBox)
                
                // Create thumbnail with specified scale
                let contextSize = CGSize(
                    width: pageRect.width * finalScale,
                    height: pageRect.height * finalScale
                )
                
                UIGraphicsBeginImageContextWithOptions(contextSize, false, 0.0)
                guard let context = UIGraphicsGetCurrentContext() else { continue }
                
                // White background
                context.setFillColor(UIColor.white.cgColor)
                context.fill(CGRect(origin: .zero, size: contextSize))
                
                // Draw PDF page
                context.scaleBy(x: finalScale, y: finalScale)
                pdfPage.draw(with: .mediaBox, to: context)
                
                // Get image
                if let image = UIGraphicsGetImageFromCurrentImageContext(),
                   let imageData = image.pngData() {
                    coverList.append([
                        "cover": imageData.base64EncodedString(),
                        "page": pageIndex + 1,
                        "size": [
                            "width": contextSize.width,
                            "height": contextSize.height
                        ],
                        "pageCount": pdfDocument.pageCount
                    ])
                }
                
                UIGraphicsEndImageContext()
            }
            
            return coverList
        }
    }
}
