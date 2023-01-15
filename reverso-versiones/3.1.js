/**Una clase, que es como una especie de generador de cosas
 * a las que les llamo categorías, que funcionan como las clases de css,
 * pero para implementarlo en javascript xd
 */
class Category{
    constructor(element,name){
        this.name=name;
        this.style=element.style;
        this.childs=[];
        this.joinedElements=[];
    }
    appendChild(category){
        category.style=this.style;
        this.childs.push(category);
    }
    setStyle(element){
        let style=element.style;
        let childs=this.childs;
        let childsSize=this.childs.length;
        this.style=style;
        for(let i=0;i<childsSize;i++){
            childs[i].style=style;
        }
    }
    join(element){
        let repeated=false;
        let joinedElements=this.joinedElements;
        let joinedElementsSize=joinedElements.length;
        for(let i=0;i<joinedElementsSize;i++){
            if(element!=joinedElements[i].element)continue;
            repeated=true;break;
        }
        if(!repeated)this.joinedElements.push({element:element,originalStyle:element.style});
        element.style=this.style;
    }
    leave(element){
        let joinedElements=this.joinedElements
        let joinedElementsSize=joinedElements.length;
        for(let i=0;i<joinedElementsSize;i++){
            if(element!=joinedElements[i].element)continue;
            element.style=joinedElements[i].originalStyle;
            joinedElements.splice(i,1);break;
        }
    }
}
/**Esta clase va a tener los metodos necesarios para hacer todo lo que
 * podemos hacer en css, pero haciéndolo en javascript
 * Igual como tampoco voy a hacer mucho coso, solo va tener lo que necesito.
 */
class CSSInteracter{
    static mediaQuery(query,actionIf,actionUnless=function(){}){
        let mediaQueryObject=matchMedia(query);
        let trigger=mediaQueryList=>{
            if(mediaQueryList.matches){
                actionIf();
            }
            else{
                actionUnless();
            }
        }
        mediaQueryObject.addListener(trigger);
        trigger(mediaQueryObject);
    }
    /*Estos se llaman Data-attributes
    La notación que se usa es data-nombre
    Ejemplo <p data-nose="hola" style="background: red"></p>*/
    static setCustomAttribute(element,name,value){
        element.setAttribute('data-'+name,value);
    }
    static getCustomAttribute(element,name){
        return element.getAttribute('data-'+name);
    }
    static removeCustomAttribute(element,name){
        element.removeAttribute('data-'+name);
    }
    static hasCustomAttribute(element,name){
        return element.hasAttribute('data-'+name);
    }
    static getCustomAttributesObject(element){
        return element.dataset;
    }
    /*Estos en CSS se ponen con :: después del padre */
    static getPseudoElement(parent,name){
        return getComputedStyle(parent,':'+name);
    }
    /*Estas son variables css, se conocen como 
    Custom Properties, al declararlas en :root,
    se hace con -- al inicio, y el nombre con - 
    en vez de espacios, es la notación*/
    static setVariable(name,value){
        let htmlStyle=document.documentElement.style;
        htmlStyle.setProperty('--'+name,value);
    }
    static getVariable(name){
        let html=document.documentElement;
        return getComputedStyle(html).getPropertyValue('--'+name);
    }
    //Esto es completamente inutil :)
    /*En css para poner varias clases se separan con espacios*/
    static getClassList(element){
        return element.classList;
    }
}

class HTMLInteracter{
    constructor(){
        this.elementList=[];
    }
    addElement(type,parent=document.body){
        let element=document.createElement(type);
        parent.appendChild(element);
        this.elementList.push({element:element,childs:[]});
    }
    removeElement(index,parent=document.body){
        parent.removeChild(this.elementList[index].element);
        this.elementList.splice(index,1);
    }
    getStyle(index){
        return this.elementList[index].element.style;
    }
    getElement(index){
        return this.elementList[index].element;
    }
    addInside(index,type){
        let parent=this.elementList[index].element;
        let child=document.createElement(type);
        parent.appendChild(child);
        this.elementList[index].childs.push({element:child,childs:[]});
    }
    removeInside(indexOut,indexIn){
        let parent=this.elementList[indexOut].element;
        let childs=this.elementList[indexOut].childs;
        let child=childs[indexIn].element;
        parent.removeChild(child);
        childs.splice(indexIn,1);
    }
    goInside(index){
        let childs=this.elementList[index].childs;
        let element=this.elementList[index].element;
        let response=new HTMLInteracter();
        response.elementList=childs;
        return response;
    }
}

//Utilidades

class Positioner{
    constructor(){
        this.history=[];
    }
    alignInside(parent,child,mode){
        let positioner=document.createElement('div');
        let positionerStyle=positioner.style;
        positionerStyle.width='100%';
        positionerStyle.height='100%';
        positionerStyle.display='flex';
        positionerStyle.flexWrap='wrap';
        if(mode=='top-left'){
            positionerStyle.justifyContent='start';
            positionerStyle.alignContent='start';
        }
        else if(mode=='top-center'){
            positionerStyle.justifyContent='center';
            positionerStyle.alignContent='start';
        }
        else if(mode=='top-right'){
            positionerStyle.justifyContent='end';
            positionerStyle.alignContent='start';
        }
        else if(mode=='center-left'){
            positionerStyle.justifyContent='start';
            positionerStyle.alignContent='center';
        }
        else if(mode=='center'||mode=='center-center'){
            positionerStyle.justifyContent='center';
            positionerStyle.alignContent='center';
        }
        else if(mode=='center-right'){
            positionerStyle.justifyContent='end';
            positionerStyle.alignContent='center';
        }
        else if(mode=='bottom-left'){
            positionerStyle.justifyContent='start';
            positionerStyle.alignContent='end';
        }
        else if(mode=='bottom-center'){
            positionerStyle.justifyContent='center';
            positionerStyle.alignContent='end';
        }
        else if(mode=='bottom-right'){
            positionerStyle.justifyContent='end';
            positionerStyle.alignContent='end';
        }
        this.history.push({positioner:positioner,parent:parent,child:child});
        parent.removeChild(child);
        positioner.appendChild(child);
        parent.appendChild(positioner);
    }
    adjust(parent,child,orientation,min,max,crossSize='100%'){
        let positioner=document.createElement('div');
        let positionerStyle=positioner.style;
        positionerStyle.width='100%';
        positionerStyle.height='100%';
        positionerStyle.display='flex';
        positionerStyle.alignItems='center';
        positionerStyle.flexWrap='wrap';
        let childStyle=child.style;
        childStyle.flexGrow='1';
        if(orientation=='vertical'){
            positionerStyle.flexDirection='column';
            childStyle.width=crossSize;
            childStyle.minHeight=min;
            childStyle.maxHeight=max;
        }
        else if(orientation=='horizontal'){
            positionerStyle.flexDirection='row';
            childStyle.height=crossSize;
            childStyle.minWidth=min;
            childStyle.maxWidth=max;
        }
        this.history.push({positioner:positioner,parent:parent,child:child});
        parent.removeChild(child);
        positioner.appendChild(child);
        parent.appendChild(positioner);
    }
    removePositioner(index){
        let registry=this.history[index];
        registry.parent.removeChild(registry.positioner);
        return registry.child;
    }
    deleteHistory(){
        this.history=[];
    }
}
class Table{
    changeColumnsSize(string){
        let parameters=string.trim().split(' ');
        let columns=this.columns;
        let columnsNumber=columns.length;
        for(let i=0;i<columnsNumber;i++){
            let parameter=parameters[i];
            let columnStyle=columns[i].element.style;
            if(parameter.endsWith('fr')){
                columnStyle.width='0';
                columnStyle.flexGrow=parameter.slice(0,parameter.length-2);
            }
            else{
                columnStyle.width=parameter;
            }
        }
    }
    changeRowsSize(string){
        let parameters=string.trim().split(' ');
        let columns=this.columns;
        let columnsNumber=columns.length;
        for(let i=0;i<columnsNumber;i++){
            let cells=columns[i].cells;
            let cellsNumber=cells.length;
            for(let j=0;j<cellsNumber;j++){
                let parameter=parameters[j];
                let cellStyle=cells[j].style;
                if(parameter.endsWith('fr')){
                    cellStyle.height='0';
                    cellStyle.flexGrow=parameter.slice(0,parameter.length-2);
                }
                else{
                    cellStyle.height=parameter;
                }
            }
        }
    }
    constructor(columns,rows){
        this.columns=[];
        let background=document.createElement('div');
        let backgroundStyle=background.style;
        backgroundStyle.display='flex';
        backgroundStyle.height='100%';
        backgroundStyle.width='100%';
        let columnsNumber=columns.trim().split(' ').length;
        for(let i=0;i<columnsNumber;i++){
            let column=document.createElement('div');
            let columnStyle=column.style;
            columnStyle.height='100%';
            columnStyle.display='flex';
            columnStyle.flexDirection='column';


            let columnCells=[];
            let rowsNumber=rows.trim().split(' ').length;
            for(let j=0;j<rowsNumber;j++){
                let cell=document.createElement('div');
                let cellStyle=cell.style;
                cellStyle.width='100%';
                column.appendChild(cell);
                columnCells.push(cell);
            }
            background.appendChild(column);
            this.columns.push({element:column,cells:columnCells});
            console.log('test2');
            console.log(columnCells[0]);
            //let asd=this.columns[this.columns.length-1].cells[0].style;
        }
        this.changeColumnsSize(columns);this.changeRowsSize(rows);
        this.element=background;
    }
    getCell(row,column){
        return this.columns[column-1].cells[row-1];
    }
    getStyle(row,column){
        return this.getCell(row,column).style;
    }
    color(color){
        let columns=this.columns;
        let columnsNumber=columns.length;
        for(let i=0;i<columnsNumber;i++){
            let cells=columns[i].cells;
            let cellsNumber=cells.length;
            for(let j=0;j<cellsNumber;j++){
                cells[j].style.backgroundColor=color;
            }
        }
    }
}






let title=document.createElement('title');
document.head.appendChild(title);
title.textContent='textopro';
let meta1=document.createElement('meta');
document.head.appendChild(meta1);
meta1.charset='utf-8';
let meta2=document.createElement('meta');
document.head.appendChild(meta2);
meta2.name='viewport';
meta2.content='width=device-width, initial-scale=1.0';

let wide=false;

CSSInteracter.mediaQuery('(min-width: 981px)',()=>{
    document.body.style.backgroundColor='darkslategray';
    wide=true;
},()=>{
    document.body.style.backgroundColor='green';
    wide=false;
});
CSSInteracter.mediaQuery('(orientation: landscape',()=>{
    document.body.style.backgroundColor='darkslategray';
    wide=true;
},()=>{
    document.body.style.backgroundColor='green';
    wide=false;
});
function normalize(){
    let all=document.querySelectorAll('*');
    let allSize=all.length;
    for(let i=0;i<allSize;i++){
        let current=all[i];
        current.style.boxSizing='border-box';
        current.style.padding='0';
        current.style.margin='0';
    }
}

let headStuff=new HTMLInteracter();
normalize();


headStuff.addElement('link',document.head);
headStuff.getElement(0).rel='stylesheet';
headStuff.getElement(0).type='text/css';
headStuff.getElement(0).href='reverso3.css';
headStuff.addElement('link',document.head);
headStuff.getElement(1).rel='stylesheet';
headStuff.getElement(1).href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css';

let test=new HTMLInteracter();
test.addElement('div');
test.getElement(0).style.height='100vh';
test.getElement(0).style.width='100vw';

let tablaTest=new Table('1fr','1fr 3fr 2fr 3fr');
test.getElement(0).appendChild(tablaTest.element);
let pos = new Positioner();
pos.adjust(test.getElement(0),tablaTest.element,'vertical','600px','100%','90%');
tablaTest.element.style.backgroundColor='royalblue';
tablaTest.element.style.paddingTop='5%';
tablaTest.element.style.paddingBottom='5%';
let header=new Table('1fr 3fr 1fr','1fr');
tablaTest.getCell(1,1).appendChild(header.element);
let boton=document.createElement('div');
boton.className='glyphicon glyphicon-menu-hamburger';
boton.style.color='black';
boton.style.backgroundColor='gray';
boton.style.minWidth='53px';
boton.style.minHeight='53px';
boton.style.fontSize='42px';
boton.style.padding='5px';
boton.style.lineHeight='1';

header.getCell(1,3).appendChild(boton);
pos.alignInside(header.getCell(1,3),boton,'center');

let titulo=document.createElement('div');
titulo.textContent='Invierte tu texto';
titulo.style.textAlign='center';
titulo.style.fontSize='28px';
header.getCell(1,2).appendChild(titulo);
pos.alignInside(header.getCell(1,2),titulo,'bottom-center');



function texto(tipo){
    let body=document.createElement('div');
    body.style.width='90%';
    body.style.height='100%';
    body.style.backgroundColor='red';
    let tablabody=new Table('1fr','1fr 4fr');
    body.appendChild(tablabody.element);
    let type;let coso;let texto;
    if(tipo=='input'){
        type='textarea';
        coso='none';
        texto='Volver a usar mismo texto';


        let repetir=document.createElement('div');
        repetir.style.width='45%';
        repetir.style.height='70%';
        repetir.style.fontSize='11px';
        repetir.style.display='flex';
        repetir.style.alignItems='center';
        repetir.style.justifyContent='center';
        repetir.textContent='Volver a usar mismo texto';
        repetir.style.backgroundColor='indianred';
        repetir.style.textAlign='center';
        tablabody.getCell(1,1).appendChild(repetir);
    }else if(tipo=='output'){
        type='div';
        coso='auto';
        texto='El texto transformado queda:';


        tablabody.getCell(1,1).style.display='flex';
        tablabody.getCell(1,1).style.alignItems='center';
        tablabody.getCell(1,1).style.justifyContent='center';
        tablabody.getCell(1,1).style.textAlign='center';
        tablabody.getCell(1,1).textContent=texto;
    }
    let cuadro=document.createElement(type);
    let fondo=document.createElement('div');
    if(coso=='auto'){
        cuadro.style.overflow=coso;
    }
    else if(coso=='none'){
        cuadro.placeholder='Insertar texto';
        cuadro.style.resize=coso;
    }
    fondo.style.width='100%';
    fondo.style.height='100%';
    fondo.style.backgroundColor='blueviolet';
    cuadro.style.width='100%';
    cuadro.style.height='80%';
    cuadro.style.backgroundColor='olivedrab';

    fondo.appendChild(cuadro);
    body.appendChild(tablabody.element);
    tablabody.getCell(2,1).appendChild(fondo);
    return {arriba:tablabody.getCell(1,1),fondo:fondo,body:body,cuadro:cuadro,tabla:tablabody};
}
//let body1=document.createElement('div');
//tablaTest.getCell(2,1).appendChild(body1);
let body1=texto('input');
tablaTest.getCell(2,1).appendChild(body1.body);
console.log(tablaTest.getCell(2,1));

//pos.alignInside(tablaTest.getCell(2,1),body1,'center');
//body1.appendChild(tablabody1.element);
pos.alignInside(tablaTest.getCell(2,1),body1.body,'center');

//texto(tablabody1.getCell(2,1),'input');




let body2=new Table('1fr 1fr 1fr 1fr','1fr');
tablaTest.getCell(3,1).appendChild(body2.element);


//let body3=document.createElement('div');
//tablaTest.getCell(4,1).appendChild(body3);
let body3=texto('output');
tablaTest.getCell(4,1).appendChild(body3.body);
console.log(tablaTest.getCell(4,1));


//pos.alignInside(tablaTest.getCell(4,1),body3,'center');
//body3.appendChild(tablabody3.element);
pos.alignInside(tablaTest.getCell(4,1),body3.body,'center');

//texto(tablabody3.getCell(2,1),'output');





/*test.addElement('div',test.getElement(0));
test.getElement(1).style.backgroundColor='royalblue';
let pos = new Positioner();
pos.adjust(test.getElement(0),test.getElement(1),'vertical','600px','90%','90%');*/
//test.getElement(1).style.height='100%';
//test.getElement(1).style.width='100%';








/*test.addElement('div',test.getElement(0));
test.getElement(1).style.width='80%';
test.getElement(1).style.minHeight='570px';
test.getElement(1).style.backgroundColor='royalblue';

let pos=new Positioner();
pos.alignInside(test.getElement(0),test.getElement(1),'center');
let tablaTest=new Table('1fr 2fr 1fr','2fr 1fr 2fr');
test.getElement(1).appendChild(tablaTest.element);
pos.adjust(test.getElement(1),tablaTest.element,'vertical','600px','90%','90%');
tablaTest.width='100%';tablaTest.height='100%';*/
