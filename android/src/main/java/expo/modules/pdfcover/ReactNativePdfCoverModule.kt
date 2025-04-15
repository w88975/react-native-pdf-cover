package expo.modules.pdfcover

import android.graphics.Bitmap
import android.net.Uri
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.ByteArrayOutputStream
import java.io.File
import android.util.Base64
import android.content.Context
import kotlin.coroutines.suspendCoroutine
import android.graphics.pdf.PdfRenderer;
import android.os.ParcelFileDescriptor;
import java.io.IOException;
import android.graphics.Canvas
import android.graphics.Color

class ReactNativePdfCoverModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ReactNativePdfCover")

    AsyncFunction("getPdfCover") { path: String, password: String?, page: Int, width: Double?, height: Double?, scale: Double? ->
      val context = appContext.reactContext!!
      
      val parcelFileDescriptor = ParcelFileDescriptor.open(File(path), ParcelFileDescriptor.MODE_READ_ONLY)
        ?: throw Exception("[react-native-pdf-cover] Failed to open PDF")

      var renderer: PdfRenderer? = null
      try {
        renderer = PdfRenderer(parcelFileDescriptor)

        if (page < 1 || page > renderer.pageCount) {
          throw Exception("[react-native-pdf-cover] Invalid page number")
        }

        val pdfPage = renderer.openPage(page - 1)

        val pageWidth = pdfPage.width
        val pageHeight = pdfPage.height

        val targetWidth = width?.toInt() ?: (pageWidth * (scale ?: 1.0)).toInt()
        val targetHeight = height?.toInt() ?: (pageHeight * (scale ?: 1.0)).toInt()

        val bitmap = Bitmap.createBitmap(targetWidth, targetHeight, Bitmap.Config.ARGB_8888)
        
        // Create a canvas with white background
        val canvas = Canvas(bitmap)
        canvas.drawColor(Color.WHITE)
        
        pdfPage.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)

        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
        val base64String = Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT)

        val result = mapOf(
          "cover" to base64String,
          "page" to page,
          "size" to mapOf(
            "width" to targetWidth,
            "height" to targetHeight
          ),
          "pageCount" to renderer.pageCount // 这里访问 renderer.pageCount 需要保证 renderer 还未关闭
        )

        bitmap.recycle()
        pdfPage.close()
        renderer.close()
        parcelFileDescriptor.close()

        return@AsyncFunction result
      } catch (e: Exception) {
        renderer?.close()
        parcelFileDescriptor.close()
        throw Exception("PDF Rendering Error: ${e.message}")
      }
    }

    AsyncFunction("getPdfCoverList") { path: String, password: String?, scale: Double ->
      val context = appContext.reactContext!!
      
      val parcelFileDescriptor = ParcelFileDescriptor.open(File(path), ParcelFileDescriptor.MODE_READ_ONLY)
        ?: throw Exception("Failed to open PDF")

      try {
        val renderer = PdfRenderer(parcelFileDescriptor)
        val results = mutableListOf<Map<String, Any>>()
        val pageCount = renderer.pageCount

        for (pageIndex in 0 until pageCount) {
          val pdfPage = renderer.openPage(pageIndex)

          val targetWidth = (pdfPage.width * scale).toInt()
          val targetHeight = (pdfPage.height * scale).toInt()

          val bitmap = Bitmap.createBitmap(targetWidth, targetHeight, Bitmap.Config.ARGB_8888)
          
          // Create a canvas with white background
          val canvas = Canvas(bitmap)
          canvas.drawColor(Color.WHITE)

          pdfPage.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)

          val outputStream = ByteArrayOutputStream()
          bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
          val base64String = Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT)

          results.add(
            mapOf(
              "cover" to base64String,
              "page" to (pageIndex + 1),
              "size" to mapOf("width" to targetWidth, "height" to targetHeight),
              "pageCount" to pageCount
            )
          )

          bitmap.recycle()
          pdfPage.close()
        }

        renderer.close()
        parcelFileDescriptor.close()

        return@AsyncFunction results
      } catch (e: Exception) {
        parcelFileDescriptor.close()
        throw Exception("PDF Rendering Error: ${e.message}")
      }
    }
  }
}