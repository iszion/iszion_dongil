export default {
  dataJsonParse(resIud, resFormData) {
    // console.log('util : ', resIud, JSON.stringify(resFormData));
    // form json data 를 json data 파싱
    let jsonFormData = JSON.stringify(resFormData);

    // 신규,수정 데이타 저장 변수
    let data = [];
    // 삭제 데이타 저장 변수
    let dataDel = [];

    if (resIud === 'I') {
      data[0] = '{"mode":"I","data":' + jsonFormData + '}';
    } else if (resIud === 'U') {
      data[0] = '{"mode":"U","data":' + jsonFormData + '}';
    } else if (resIud === 'S') {
      data[0] = '{"mode":"S","data":' + jsonFormData + '}';
    } else if (resIud === 'N') {
      data[0] = '{"mode":"N","data":' + jsonFormData + '}';
    } else if (resIud === 'D') {
      dataDel[0] = '{"mode":"D","data":' + jsonFormData + '}';
    }
    let obj = this.jsonFiller(data, dataDel);
    return JSON.stringify(obj).replace(/null/gi, '');
  },

  jsonFiller(resObj, resObjDel) {
    let jsonData = {};

    // 신규, 수정 자료 정리 부분
    let tmpDataI = [];
    let tmpDataU = [];
    let tmpDataN = [];
    let tmpDataS = [];
    let tmpDataD = [];

    if (resObj.length > 0) {
      for (let i = 0; i < resObj.length; i++) {
        let objTmp = JSON.parse(resObj[i]);
        if (objTmp.mode === 'I') {
          tmpDataI.push(objTmp.data);
        } else if (objTmp.mode === 'U') {
          tmpDataU.push(objTmp.data);
        } else if (objTmp.mode === 'N') {
          tmpDataN.push(objTmp.data);
        } else if (objTmp.mode === 'S') {
          tmpDataS.push(objTmp.data);
        } else {
        }
      }
      jsonData.I = tmpDataI;
      jsonData.U = tmpDataU;
      jsonData.N = tmpDataN;
      jsonData.S = tmpDataS;
    } else {
      jsonData.I = [];
      jsonData.U = [];
      jsonData.N = [];
      jsonData.S = [];
    }

    // 삭제 자료 정리 부분
    tmpDataD = [];
    if (resObjDel.length > 0) {
      for (let i = 0; i < resObjDel.length; i++) {
        let objTmp = JSON.parse(resObjDel[i]);
        tmpDataD.push(objTmp.data);
      }
      jsonData.D = tmpDataD;
    } else {
      jsonData.D = [];
    }

    let jsonReturnData = {};
    jsonReturnData.no1 = jsonData;

    return jsonReturnData;
  },
};
