import { useEvent } from "expo";
import { getPDFCover, getPdfCoverList } from "react-native-pdf-cover";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";

interface PdfCoverResult {
  cover: string;
  page: number;
  size: {
    width: number;
    height: number;
  };
  pageCount: number;
}

export default function App() {
  const [coverResult, setCoverResult] = useState<PdfCoverResult | null>(null);
  const [coverResults, setCoverResults] = useState<PdfCoverResult[]>([]);

  const handleSelectPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.assets && result.assets[0]) {
        const pdfUri = result.assets[0].uri;
        // 调用getPdfCover获取封面
        const coverResult = await getPDFCover({
          path: pdfUri,
          password: "",
          page: 1,
          size: {
            width: 600.1,
            height: 600.1,
          },
          scale: 1,
        });

        setCoverResult(coverResult);
        console.log("PDF封面获取成功", coverResult.size);
      }
    } catch (error) {
      console.error("选择PDF文件失败:", error);
    }
  };

  const handleGetAllPages = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.assets && result.assets[0]) {
        const pdfUri = result.assets[0].uri;
        const results = await getPdfCoverList({
          path: pdfUri,
          scale: 1,
        });

        setCoverResults(results);
        console.log(`获取到 ${results.length} 页PDF截图`);
        console.log(results);
      }
    } catch (error) {
      console.error("获取PDF页面失败:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="PDF Cover">
          <Button title="选择PDF文件（单页）" onPress={handleSelectPDF} />
          <Button title="选择PDF文件（所有页面）" onPress={handleGetAllPages} />
          {coverResult && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: `data:image/png;base64,${coverResult.cover}` }}
                style={[
                  styles.coverImage,
                  {
                    width: coverResult.size.width,
                    height: coverResult.size.height,
                  },
                ]}
                resizeMode="contain"
              />
              <Text>
                页码: {coverResult.page}/{coverResult.pageCount}
              </Text>
              <Text>
                尺寸: {coverResult.size.width.toFixed(0)}x
                {coverResult.size.height.toFixed(0)}
              </Text>
            </View>
          )}
          {coverResults.length > 0 && (
            <View style={styles.imageGrid}>
              {coverResults.map((result, index) => (
                <View key={index} style={styles.gridItem}>
                  <Image
                    source={{ uri: `data:image/png;base64,${result.cover}` }}
                    style={styles.gridImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.pageNumber}>第{result.page}页</Text>
                </View>
              ))}
            </View>
          )}
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  coverImage: {
    width: 300,
    height: 400,
    backgroundColor: "#f0f0f0",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  gridImage: {
    width: 150,
    height: 200,
    margin: 5,
    backgroundColor: "#f0f0f0",
  },
  gridItem: {
    alignItems: "center",
    margin: 5,
  },
  pageNumber: {
    marginTop: 5,
    fontSize: 12,
  },
});
