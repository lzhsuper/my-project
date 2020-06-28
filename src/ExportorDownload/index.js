import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { green } from '@material-ui/core/colors';
import XLSX from 'xlsx';
import { message, Upload } from 'antd';

export default function ExportOrDwonload({ result, ifselect, SetHomeUpload, setuploadname, setuploadtitle, search }) {
    // const theme = createMuiTheme();
    const [File, SetFile] = useState(null);
    const DownLoadButton = withStyles(theme => ({
        root: {
            //    color: theme.palette.getContrastText(green[500]),
            backgroundColor: green[700],
            '&:hover': {
                backgroundColor: green[900],
            },
        },
    }))(Button);
    const UploadButton = withStyles(theme => ({
        root: {
            //    color: theme.palette.getContrastText(green[500]),
            backgroundColor: green[700],
            width: 140,
            '&:hover': {
                backgroundColor: green[900],
            },
        },
    }))(Button);


    function UploadAction(file) {
        // 获取上传的文件对象
        const files = file;
        // 通过FileReader对象读取文件
        const fileReader = new FileReader();
        fileReader.onload = event => {
            try {
                const { result } = event.target;
                // 以二进制流方式读取得到整份excel表格对象
                const workbook = XLSX.read(result, { type: 'binary' });
                // 存储获取到的数据
                let data = [];
                //存储表头
                const languageTitle = [];
                let exceltitle = [];
                let sheetspage = [];
                for (const sheetpage in workbook.Sheets) {
                    sheetspage.push(sheetpage)
                }
                Object.keys(workbook.Sheets[sheetspage[0]]).map((key) => {
                    if (Number(key.slice(1,)) <= 1) {
                        exceltitle.push(key);
                    }
                });
                exceltitle.map((key) => languageTitle.push(workbook.Sheets[sheetspage[0]][key].v));
                setuploadtitle(languageTitle);
                // workbook.Sheets[file.name.splice(0,-5)]

                // 遍历每张工作表进行读取（这里默认只读取第一张表）
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        // 利用 sheet_to_json 方法将 excel 转成 json 数据
                        data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                        break; // 如果只取第一张表，就取消注释这行
                    }
                }
                // 最终获取到并且格式化后的 json 数据
                message.success('文件解析成功！');
                // data.map((item) => item.hasOwnProperty('en') ? true : item.en = null);
                // data.map((item) => item.hasOwnProperty('es') ? true : item.en = null);
                // data.map((item) => item.hasOwnProperty('ko') ? true : item.en = null);
                // data.map((item) => item.hasOwnProperty('ja') ? true : item.en = null);
                // data.map((item) => item.hasOwnProperty('sk') ? true : item.en = null);
                // data.map((item) => item.hasOwnProperty('cs') ? true : item.en = null);
                // data.map((item) => item.hasOwnProperty('fr') ? true : item.en = null);
                //
                //         item.hasOwnProperty('es') ?
                //             item.hasOwnProperty('ko') ?
                //                 item.hasOwnProperty('ja') ?
                //                     item.hasOwnProperty('sk') ?
                //                         item.hasOwnProperty('cs') ?
                //                             item.hasOwnProperty('fr')
                //                                 ? true
                //                                 : item.fr = null
                //                             : item.cs = null
                //                         : item.sk = null
                //                     : item.ja = null
                //                 : item.ko = null
                //             : item.es = null
                //         :
                // );
                SetHomeUpload(data);
                setuploadname(file.name)
            } catch (e) {
                // 这里可以抛出文件类型错误不正确的相关提示
                message.error('文件类型不正确！');
            }
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files);
    }

    function DownLoad(fileName = 'LanguageEdit.xlsx') {
        let data = null;
        if (result !== null) {
            data = JSON.parse(JSON.stringify(result));
            data.map((item) => item.map((itemu) => {
                {
                    if (itemu.new_en !== undefined && itemu.new_en !== null && itemu.new_en !== '') {
                        itemu.en = itemu.new_en;
                    }
                    if (itemu.new_es !== undefined && itemu.new_es !== null && itemu.new_es !== '') {
                        itemu.es = itemu.new_es;
                    }
                    if (itemu.new_ko !== undefined && itemu.new_ko !== null && itemu.new_ko !== '') {
                        itemu.ko = itemu.new_ko;
                    }
                    if (itemu.new_ja !== undefined && itemu.new_ja !== null && itemu.new_ja !== '') {
                        itemu.ja = itemu.new_ja;
                    }
                    if (itemu.new_sk !== undefined && itemu.new_sk !== null && itemu.new_sk !== '') {
                        itemu.sk = itemu.new_sk;
                    }
                    if (itemu.new_fr !== undefined && itemu.new_fr !== null && itemu.new_fr !== '') {
                        itemu.fr = itemu.new_fr;
                    }
                    if (itemu.new_cs !== undefined && itemu.new_cs !== null && itemu.new_cs !== '') {
                        itemu.cs = itemu.new_cs;
                    }
                    if (itemu.new_pt !== undefined && itemu.new_pt !== null && itemu.new_pt !== '') {
                        itemu.pt = itemu.new_pt;
                    }
                }
            }));
        }
        if (data === null) {
            return
        }
        const initColumn = [];
        for (let title in result[0][0]) {
            if (title.slice(0, 3) === 'new') {
                continue
            } else if (title === 'status') {
                break
            }
            initColumn.push({ title: title, dataIndex: title, key: title })
        }
        const _headers = initColumn
            .map((item, i) => Object.assign({}, {
                key: item.title,
                title: item.title,
                position: String.fromCharCode(65 + i) + 1
            }))
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { key: next.key, v: next.title } }), {});
        // 对刚才的结果进行降维处理（二维数组变成一维数组）
        data = data.reduce((prev, next) => prev.concat(next));
        const datanew = data
            .map((item, i) => initColumn.map((key, j) => Object.assign({}, {
                content: item[key.key],
                position: String.fromCharCode(65 + j) + (i + 2)
            })));
        // 对刚才的结果进行降维处理（二维数组变成一维数组）
        const _data = datanew.reduce((prev, next) => prev.concat(next))
            // 转换成 worksheet 需要的结构
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.content } }), {});
        Object.keys(_data).map((item) => _data[item].v === null ? _data[item].v = 'No content' : null);
        // 合并 headers 和 data
        const output = Object.assign({}, _headers, _data);
        // 获取所有单元格的位置
        const outputPos = Object.keys(output);
        // 计算出范围 ,["A1",..., "H2"]
        const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

        // 构建 workbook 对象
        const wb = {
            SheetNames: ['LanguageEdit'],
            Sheets: {
                LanguageEdit: Object.assign(
                    {},
                    output,
                    {
                        '!ref': ref,
                        '!cols': [{ wpx: 45 }, { wpx: 100 }, { wpx: 200 }, { wpx: 80 }, { wpx: 150 }, { wpx: 100 }, { wpx: 300 }, { wpx: 300 }],
                    },
                ),
            },
        };

        // 导出 Excel
        XLSX.writeFile(wb, fileName);
    }

    if (ifselect === 'export') {
        return (
            <div>
                <DownLoadButton fullWidth
                    color="primary"
                    variant="contained"
                    endIcon={<SaveIcon />}
                    onClick={() => DownLoad()}>
                    Download
                </DownLoadButton>
            </div>
        )
    } else if (ifselect === 'upload') {
        return (
            <div>
                <Upload
                    beforeUpload={(file) => {
                        UploadAction(file);
                        SetFile([file]);
                        return false;
                    }}
                    showUploadList={false}
                >
                    <UploadButton fullWidth
                        color="secondary"
                        variant="contained"
                        endIcon={<CloudUploadIcon />}
                    >
                        Upload
                    </UploadButton>
                </Upload>
            </div>
        )
    }
}
