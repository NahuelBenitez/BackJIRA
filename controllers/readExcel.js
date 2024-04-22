import path, {dirname} from 'path'
import { fileURLToPath } from 'url';
import xlsxPopulate from 'xlsx-populate'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ruta = path.resolve(__dirname,'datosPrueba.xlsx')


export async function readExcel(nameSheet){
    const workbook = await xlsxPopulate.fromFileAsync(ruta)
    let data = workbook.sheet(nameSheet).usedRange().value()

    let names = data[0]
    let valuesNotNames = data.slice(1)

    //let dataParsed = valuesNotNames.map((value,i) => console.log(value[names[0]]))
    let dataParsed = valuesNotNames.map(data =>{
        let dataObject = {}
        data.forEach((valor,i) => {
            dataObject[names[i]] = valor
        })
        return dataObject
    })

    return dataParsed
}

