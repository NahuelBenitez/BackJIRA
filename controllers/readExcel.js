
let path = require('path')
const XlsxPopulate = require('xlsx-populate');

const ruta = path.resolve(__dirname, '..', 'uploads', 'datosPrueba(2).xlsx');


async function readExcel(nameSheet) {
    console.log(ruta)
    const workbook = await XlsxPopulate.fromFileAsync(ruta)
    let data = workbook.sheet(nameSheet).usedRange().value()

    let names = data[0]
    let valuesNotNames = data.slice(1)

    console.log(valuesNotNames)
    //let dataParsed = valuesNotNames.map((value,i) => console.log(value[names[0]]))
    let dataParsed = valuesNotNames.map(data => {
        let dataObject = {}
        data.forEach((valor, i) => {
            dataObject[names[i]] = valor
        })
        return dataObject
    })

    return dataParsed

}

module.exports = {
    readExcel
}

