"use client";

import { useState } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

import styles from "./page.module.scss";

// 假设 Excel 数据的一行是一个对象，这里我们使用泛型进行类型声明
interface ExcelRow {
  [key: string]: any; // 根据实际的 Excel 数据结构进一步定义字段类型
}

export default function ExcelToHtml() {
  const [fileData, setFileData] = useState<string>("");

  async function readExcel(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          resolve(XLSX.utils.sheet_to_json(worksheet));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  async function handleUpload(file: Blob) {
    try {
      const data: ExcelRow[] = (await readExcel(file)) as ExcelRow[];

      const excelData = data.map((item, index) => ({
        ...item,
        id: "item-" + Date.now() + "-" + index,
      }));

      setFileData(JSON.stringify(excelData));
    } catch (error) {
      alert("文件解析失败，请检查文件格式");
      console.error(error);
    }
    return false;
  }

  const generateHtml = () => {
    if (!fileData) return;

    let htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>苗木信息查询系统</title>
    <script> let excelData = ${fileData}</script>
    `;

    htmlContent =
      htmlContent +
      "<script src=\"https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js\"></script>\
    <style>\
        :root {\
            --primary: #2ecc71;\
            --secondary: #27ae60;\
            --highlight: #ffeb3b;\
            --phone: #e74c3c;\
        }\
        * {\
            margin: 0;\
            padding: 0;\
            box-sizing: border-box;\
            font-family: 'Helvetica Neue', '微软雅黑', sans-serif;\
        }\
        body {\
            background: #f8f9fa;\
            padding: 20px;\
            min-height: 100vh;\
        }\
        .container {\
            max-width: 800px;\
            margin: 0 auto;\
        }\
        .upload-section {\
            background: white;\
            padding: 25px;\
            border-radius: 15px;\
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);\
            margin-bottom: 25px;\
            text-align: center;\
        }\
        #fileInput {\
            display: none;\
        }\
        .upload-btn {\
            background: var(--primary);\
            color: white;\
            padding: 12px 30px;\
            border-radius: 30px;\
            cursor: pointer;\
            transition: all 0.3s;\
            display: inline-block;\
        }\
        .upload-btn:hover {\
            transform: translateY(-2px);\
            background: var(--secondary);\
        }\
        .search-box {\
            display: flex;\
            gap: 10px;\
            margin-bottom: 25px;\
            flex-wrap: wrap;\
        }\
        #searchInput {\
            flex: 1;\
            padding: 14px 20px;\
            border: 2px solid #ddd;\
            border-radius: 30px;\
            font-size: 16px;\
            transition: all 0.3s;\
        }\
        #searchInput:focus {\
            border-color: var(--primary);\
            outline: none;\
            box-shadow: 0 0 8px rgba(46,204,113,0.2);\
        }\
        .search-btn {\
            background: linear-gradient(45deg, var(--primary), var(--secondary));\
            color: white;\
            border: none;\
            padding: 14px 30px;\
            border-radius: 30px;\
            cursor: pointer;\
            transition: all 0.3s;\
        }\
        .search-btn:hover {\
            opacity: 0.9;\
            transform: translateY(-1px);\
        }\
        .result-item {\
            background: white;\
            padding: 18px;\
            margin-bottom: 15px;\
            border-radius: 10px;\
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);\
            animation: fadeIn 0.3s ease;\
        }\
        @keyframes fadeIn {\
            from { opacity: 0; transform: translateY(10px); }\
            to { opacity: 1; transform: translateY(0); }\
        }\
        .highlight {\
            background: var(--highlight);\
            padding: 2px 4px;\
            border-radius: 3px;\
        }\
        .phone-highlight {\
            color: var(--phone);\
            font-weight: bold;\
            text-decoration: none;\
        }\
        .detail-link {\
            color: var(--primary);\
            text-decoration: none;\
            display: block;\
            margin-top: 10px;\
            font-weight: 500;\
        }\
        .detail-modal {\
            position: fixed;\
            top: 0;\
            left: 0;\
            right: 0;\
            bottom: 0;\
            background: rgba(0,0,0,0.5);\
            display: none;\
            align-items: center;\
            justify-content: center;\
            padding: 20px;\
            z-index: 1000;\
        }\
        .detail-content {\
            background: white;\
            padding: 30px;\
            border-radius: 15px;\
            max-width: 600px;\
            width: 100%;\
            max-height: 80vh;\
            overflow-y: auto;\
        }\
        .detail-item {\
            margin: 15px 0;\
            padding: 12px;\
            border-bottom: 1px solid #eee;\
            line-height: 1.6;\
        }\
        .detail-item strong {\
            display: block;\
            color: #666;\
            margin-bottom: 5px;\
        }\
        .copyright {\
            text-align: center;\
            margin-top: 40px;\
            color: #666;\
            padding: 20px;\
        }\
        @media (max-width: 480px) {\
            #searchInput, .search-btn {\
                width: 100%;\
            }\
            .detail-content {\
                padding: 20px;\
            }\
            .detail-item {\
                font-size: 14px;\
            }\
        }\
    </style>\
</head>\
<body>\
    <div class=\"container\">\
        <div class=\"search-box\">\
            <input type=\"text\" id=\"searchInput\" placeholder=\"输入苗木名称、规格等关键词...\">\
            <button class=\"search-btn\" onclick=\"searchData()\">立即搜索</button>\
        </div>\
        <div id=\"results\"></div>\
        <div class=\"detail-modal\" id=\"detailModal\">\
            <div class=\"detail-content\" id=\"detailContent\"></div>\
        </div>\
        <div class=\"copyright\">\
            赵文敬发布信息专用，联系\
            <a href=\"tel:17332218527\" class=\"phone-highlight\">📱 173-3221-8527</a>\
        </div>\
    </div>\
    <script>\
        const PHONE_REGEX = /(1[3-9]\\d{9})/g;\
        function searchData() {\
            const keyword = document.getElementById('searchInput').value.trim().toLowerCase();\
            const results = document.getElementById('results');\
            results.innerHTML = '';\
            if (!keyword) {\
            showAllData();\
                return;\
            }\
            const filteredData = excelData.filter(row =>\
                Object.values(row).some(cell =>\
                    String(cell).toLowerCase().includes(keyword)\
                )\
            );\
            if (filteredData.length === 0) {\
                showMessage('未找到相关结果', 'info');\
                return;\
            }\
            filteredData.forEach(item => {\
                const matchedFields = Object.entries(item)\
                    .filter(([key, value]) =>\
                        String(value).toLowerCase().includes(keyword)\
                    );\
                const matchedContent = matchedFields\
                    .map(([key, value]) => String(value))\
                    .join(' ');\
                const matchIndex = matchedContent.toLowerCase().indexOf(keyword);\
                const start = Math.max(0, matchIndex);\
                const end = start + keyword.length + 30;\
                const snippet = matchedContent.slice(start, end);\
                const phones = [...new Set(matchedContent.match(PHONE_REGEX) || [])];\
                const resultItem = document.createElement('div');\
                resultItem.className = 'result-item';\
                resultItem.innerHTML = `\
                    <p>${highlightContent(snippet, keyword)}${end < matchedContent.length ? '...' : ''}</p>\
                    ${phones.length ? `\
                    <div style=\"margin:12px 0 8px;\">\
                        📞 相关联系方式：\
                        ${phones.map(phone => `\
                            <a href=\"tel:${phone}\" class=\"phone-highlight\">${formatPhone(phone)}</a>\
                        `).join(' ')}\
                    </div>` : ''}\
                    <a href=\"#${item.id}\" class=\"detail-link\" onclick=\"showDetail('${item.id}')\">查看完整详情 →</a>\
                `;\
                results.appendChild(resultItem);\
            });\
        }\
    showAllData();\
       function showAllData() {\
        const results = document.getElementById('results');\
        excelData.forEach(item => {\
        const filteredValues = Object.entries(item)\
    .filter(([key, value]) => key !== \"id\")\
    .map(([key, value]) => value);\
console.log(filteredValues);\
                 const phones = [\
    ...new Set(\
        filteredValues\
            .map(text => text.match(PHONE_REGEX))\
            .filter(matches => matches)\
            .flat()\
    )\
];\
            const resultItem = document.createElement('div');\
            resultItem.className = 'result-item';\
resultItem.innerHTML = `\
    <p style=\"white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">\
  ${Object.values(item).join(' ')}\
</p>\
    ${phones.length ? `\
    <div style=\"margin:12px 0 8px;\">\
        📞 相关联系方式：\
        ${phones.map(phone => `\
            <a href=\"tel:${phone}\" class=\"phone-highlight\">${formatPhone(phone)}</a>\
        `).join(' ')}\
    </div>` : ''}\
    <a href=\"#${item.id}\" class=\"detail-link\" onclick=\"showDetail('${item.id}')\">查看完整详情 →</a>\
`;\
            results.appendChild(resultItem);\
        });\
        }\
         function showDetail(id) {\
            const item = excelData.find(i => i.id === id);\
            const detailContent = document.getElementById('detailContent');\
            const modal = document.getElementById('detailModal');\
            detailContent.innerHTML = `\
        <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;\">\
            <h2 style=\"color: var(--primary);\">完整信息</h2>\
            <button\
                onclick=\"closeDetail()\"\
                style=\"\
                    padding:10px 25px;\
                    background:var(--primary);\
                    color:white;\
                    border:none;\
                    border-radius:25px;\
                    cursor:pointer;\
                \">\
                关闭\
            </button>\
        </div>\
        <div style=\"max-height: 300px; overflow-y: auto;\">\
            ${Object.entries(item)\
                    .filter(([key]) => key !== 'id')\
                    .map(([key, value]) => `\
                    <div class=\"detail-item\" style=\"margin-bottom: 10px;\">\
                        <strong>${key}</strong>\
                        <div>${formatContent(value, document.getElementById('searchInput').value.trim())}</div>\
                    </div>\
                `).join('')}\
        </div>\
    `;\
            modal.style.display = 'flex';\
        }\
        function closeDetail() {\
            document.getElementById('detailModal').style.display = 'none';\
        }\
        function highlightContent(text, keyword) {\
        if (!keyword) return text;\
            return text.replace(\
                new RegExp(keyword, 'gi'),\
                '<span class=\"highlight\">$&</span>'\
            );\
        }\
        function formatPhone(phone) {\
            return phone.replace(/(\\d{3})(\\d{4})(\\d{4})/, '$1-$2-$3');\
        }\
        function formatContent(text, keyword) {\
        if (!keyword) return text.replace(PHONE_REGEX, (match) => `<a href=\"tel:${match}\" class=\"phone-highlight\">${formatPhone(match)}</a>`)\
                .replace(/\\n/g, '<br>');\
            return text\
                .replace(new RegExp(keyword, 'gi'), '<span class=\"highlight\">$&</span>')\
                .replace(PHONE_REGEX, (match) => `<a href=\"tel:${match}\" class=\"phone-highlight\">${formatPhone(match)}</a>`)\
                .replace(/\\n/g, '<br>');\
        }\
        function showMessage(msg, type) {\
            const colors = {\
                warning: '#fff3cd',\
                info: '#d1ecf1'\
            };\
            const el = document.createElement('div');\
            el.className = 'result-item';\
            el.style.background = colors[type];\
            el.textContent = msg;\
            document.getElementById('results').appendChild(el);\
        }\
        async function readExcel(file) {\
            return new Promise((resolve, reject) => {\
                const reader = new FileReader();\
                reader.onload = (e) => {\
                    try {\
                        const data = new Uint8Array(e.target.result);\
                        const workbook = XLSX.read(data, { type: 'array' });\
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]];\
                        resolve(XLSX.utils.sheet_to_json(worksheet));\
                    } catch (error) {\
                        reject(error);\
                    }\
                };\
                reader.onerror = reject;\
                reader.readAsArrayBuffer(file);\
            });\
        }\
        document.getElementById('detailModal').addEventListener('click', function(e) {\
            if (e.target === this) closeDetail();\
        });\
        document.getElementById('searchInput').addEventListener('keypress', e => {\
            if (e.key === 'Enter') searchData();\
        });\
    </script>\
</body>\
</html>";

    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table.html";
    link.click();
    setFileData("");
  };

  return (
    <div className={styles.button_container}>
      <Upload beforeUpload={handleUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>上传XLSX文件</Button>
      </Upload>
      <Button type="primary" onClick={generateHtml} disabled={!fileData}>
        生成HTML
      </Button>
    </div>
  );
}
