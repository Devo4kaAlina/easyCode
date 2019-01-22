// объект ELEMENTS содержит "живые" узлы DOM дерева,
// которые мы выбираем при загрузке нашего app.js,
// а далее используем их обращаясь ELEMENTS.<necessaryElementName>
const ELEMENTS = {
    addDescription: getElementByClassName('add__description'),
    addValue: getElementByClassName('add__value'),
    addType: getElementByClassName('add__type'),
    budgetValue: getElementByClassName('budget__value'),
    incomeList: getElementByClassName('income__list')
    // ... other nodes
}

// Если мы используем let и const для обьявления переменных ниже по коду,
// то почему здесь списки обьявлены при помощи var?
// если нужен массив с определенного рода сущностями, то
// лучше переменную назвать <названиеСущности>List
// arrIncome ---> incomeList, arrExpenses ---> expensesList
// а так же см. стр. 295
var arrIncome = [];
var arrExpenses = [];

// Давайте приучаться сразу писать красивые хелперы :)
function getElementByClassName(className) {
    return document.getElementsByClassName(className)[0]
}

function getItemsSum(initialValue, incomeItem) {
    return initialValue += incomeItem.value;
} 


// ...Clicked, ...Added, ...Selected -
// хорошее название для результатов, но не для обработчика
// на слушателя событий принято вешать обработчика событий
// так почему бы на 
// onClick..., onCheck..., onSelect..., on....
// не вешать ...Handler

function onAddBtnClicked() {
    // не нужно лениться :) давай писать полностью
    // descEl --> descriptionElement,
    // а также следует учитывать целесообразность создания переменных
    // если бы мы descText или putValue использовали в нескольких местах
    // или хотябы descText и putValue моглибы переиспользовать для 
    // newObj = {descText, putValue}
    // ... а так нет смысла

    // let descriptionElement = getElementByClassName('add__description');
    // let valueElement = getElementByClassName('add__value');
    // let newItem = {
    //     value: +valueElement.value,
    //     description: descriptionElement.value
    // };

    let descEl = getElementByClassName('add__description');
    let descText = descEl.value;
    let valueEl = getElementByClassName('add__value');
    let putValue = +valueEl.value;
    let newObj = {
        desc: descText,
        value: putValue
    };
    
    let selEl = document.getElementsByClassName('add__type')[0];
    let selectedIndex = selEl.selectedIndex;
    let selectedOpt = selEl.options[selectedIndex].value;
    // не забываем о приведении типов(==) и сравнении на эдентичность(===)
    // в этом случае - не критично, но бывают такие "неожиданности" :)
    // '' == '0' // false
    // 0 == '' // true
    // 0 == '0' // true

    // false == 'false' // false
    // false == '0' // true

    // false == undefined // false
    // false == null // false
    // null == undefined // true

    if (selectedOpt == 'income') {
        arrIncome.push(newObj);
    } else {
        arrExpenses.push(newObj);
    }

    updatePage();


    // хотелось бы еще донести понимание того, что эта функция
    // вызывается каждый раз, когда мы нажимаем на <button class="add__btn" .../>
    // и каждый раз мы выгребаем из DOM по классу descriptionElement и др. ...
    // было бы очень круто сразу при загрузке определить елементы на странице
    // которые у нас не динамичные, т.е. не будут удаляться, 
    // а будет изменяться только их значение
    // и при вызове функции получать просто их значение
    // см. стр. 1
    // и тогда код был бы еще лучше

    // #БЫЛО_БЫ_ТАК
    // const newItem = {
    //     value: +ELEMENTS.addValue.value,
    //     description: ELEMENTS.addDescription.value,
    // };
    // const { options, selectedIndex } = ELEMENTS.addType;
    // const selectedOption = options[selectedIndex].value

    // selectedOption === 'income' ? arrIncome.push(newItem) : arrExpenses.push(newItem)

    // updatePage();

    // так же на видео была очистка description и value
    ELEMENTS.addValue.value = '';
    ELEMENTS.addDescription.value = '';
}

// функция updatePage очень "дорогостоящая" для DOM дерева !!!
function updatePage() {

    // если нам нужно пройтись по массиву 
    // и привести его к одному значению,
    // то есть замечательный метод reduce
    // и в нашем случае мы можем написать один обработчик getItemsSum
    // для калькулирования суммы всех значений в arrIncome и arrExpenses

    // #БЫЛО_БЫ_ТАК
    // const incomeTotal = arrIncome.reduce(getItemsSum, 0);
    // const expensesTotal = arrExpenses.reduce(getItemsSum, 0);
    // const budget = incomeTotal - expensesTotal;

    // calculate income, expences, sum
    let income = 0;
    for (let i = 0; i < arrIncome.length; i++) {
        income += arrIncome[i].value;
    }

    let expenses = 0;
    for (let i = 0; i < arrExpenses.length; i++) {
        expenses -= arrExpenses[i].value;
    }

    let sum = income + expenses;

    // budgetEl, incomeEl и expensesEl так же следовало бы 
    // поместить в ELEMENTS см. стр. 1
    // запись была бы проще 
    // ELEMENTS.budgetValue.innerHTML = sum

    // и для чего знак "+" перед sum в budgetEl.innerHTML = +sum; ???
    // sum - число, а мы его снова к числу приводим?

    // update budget element
    let budgetEl = document.getElementsByClassName('budget__value')[0];
    budgetEl.innerHTML = +sum;
    
    // update income element
    let incomeEl = document.getElementsByClassName('budget__income--value')[0];
    incomeEl.innerHTML = +income;
    
    // update expenses element
    let expensesEl = document.getElementsByClassName('budget__expenses--value')[0];
    expensesEl.innerHTML = +expenses;

    // заполнение income__list - это "болючая боль" :)
    // перерисовка DOM - является достаточно "затратной" операцией
    // давай для подобного рода случаев будем использовать fragment
    // https://developer.mozilla.org/ru/docs/Web/API/Document/createDocumentFragment

    // наполнение expenses__list тоже нужно сделать через фрагмент,
    // убрать дублиравание кода и использовать функцию, которая создает
    // елементы для отображения в ДОМЕ
    // для "пробежек" помассиву, рекомендую использовать .forEach
    // можно избежать arrExpenses[i]
    // и код читабельнее

    const incomeFragment = document.createDocumentFragment();

    arrIncome.forEach((item, index) =>
        fillFragment({
            name: 'income',
            fragment: incomeFragment, 
            item, 
            index
        })
    );

    ELEMENTS.incomeList.innerHTML = '';
    ELEMENTS.incomeList.appendChild(incomeFragment);

    // // fill income list
    // let incomeListEl = document.getElementsByClassName('income__list')[0];
    // incomeListEl.innerHTML = '';
    // for (let i = 0; i < arrIncome.length; i++) {
    //     // create clearfix element
    //     let itemClearfix = document.createElement('div');
    //     itemClearfix.className = 'item clearfix';
    //     itemClearfix.id = 'income-' + i;
    //     incomeListEl.appendChild(itemClearfix);

    //     // create description element
    //     let itemDesc = document.createElement('div');
    //     itemDesc.className = 'item__description';
    //     itemDesc.innerText = arrIncome[i].desc;
    //     itemClearfix.appendChild(itemDesc);

    //     // create right clearfix element
    //     let rightClearfixEl = document.createElement('div');
    //     rightClearfixEl.className = 'right clearfix';
    //     itemClearfix.appendChild(rightClearfixEl);

    //     // create value element
    //     let itemValue = document.createElement('div');
    //     itemValue.className = 'item__value';
    //     itemValue.innerText = arrIncome[i].value;
    //     rightClearfixEl.appendChild(itemValue);

    //     // create buttom element
    //     let itemDeleteEl = document.createElement('div');
    //     itemDeleteEl.className = 'item__delete';
    //     rightClearfixEl.appendChild(itemDeleteEl);

    //     let buttonEl = document.createElement('button');
    //     buttonEl.className = 'item__delete--btn';
    //     buttonEl.deleteIndex = i;
    //     buttonEl.addEventListener("click", onDeleteIncomeItemClicked);
    //     itemDeleteEl.appendChild(buttonEl);
        
    //     let iEl = document.createElement('i');
    //     iEl.className = 'ion-ios-close-outline';
    //     buttonEl.appendChild(iEl);     
    // } 






    // переписать заполнение expenses list САМОСТОЯТЕЛЬНО

    // fill expenses list
    let expensesListEl = document.getElementsByClassName('expenses__list')[0];
    expensesListEl.innerHTML = '';

    
    for (let i = 0; i < arrExpenses.length; i++) {
        // create clearfix element
        let itemClearfix = document.createElement('div');
        itemClearfix.className = 'item clearfix';
        itemClearfix.id = 'expense-' + i;
        expensesListEl.appendChild(itemClearfix);

        // create description element
        let itemDesc = document.createElement('div');
        itemDesc.className = 'item__description';
        itemDesc.innerText = arrExpenses[i].desc;
        itemClearfix.appendChild(itemDesc);

        // create right clearfix element
        let rightClearfixEl = document.createElement('div');
        rightClearfixEl.className = 'right clearfix';
        itemClearfix.appendChild(rightClearfixEl);

        // create value element
        let itemValue = document.createElement('div');
        itemValue.className = 'item__value';
        itemValue.innerText = arrExpenses[i].value;
        rightClearfixEl.appendChild(itemValue);

        // create buttom element
        let itemDeleteEl = document.createElement('div');
        itemDeleteEl.className = 'item__delete';
        rightClearfixEl.appendChild(itemDeleteEl);

        let buttonEl = document.createElement('button');
        buttonEl.className = 'item__delete--btn';
        buttonEl.deleteIndex = i;
        buttonEl.addEventListener("click", onDeleteExpensesItemClicked);
        itemDeleteEl.appendChild(buttonEl);
        
        let iEl = document.createElement('i');
        iEl.className = 'ion-ios-close-outline';
        buttonEl.appendChild(iEl);
    } 
}

// эти функфии эдентичны за исключением какой массив мы "слайсаем"
function onDeleteIncomeItemClicked() {
    let index = this.deleteIndex;
    arrIncome.splice(index, 1);
    updatePage();
}

function onDeleteExpensesItemClicked() {
    let index = this.deleteIndex;
    arrExpenses.splice(index, 1);
    updatePage();
}
// давай напишем универсальную функцию:
// для этого в fillFragment в deleteButton елемент мы пробросим название
// какой массив нам обрабатывать
// так же в начале файле, когда мы создавали массивы arrIncome и arrExpenses 
// нам следовало бы поместить их в обект
// const budgetLists = { income: [], expenses: [] };
// но пока напишем такую заглушку
const budgetLists = {
    income: arrIncome,
    expenses: arrExpenses
};
// и тогда "магия" ...
function onDeleteItemHandler() {
    budgetLists[this.name].splice(this.value, 1);
    updatePage();
}

function fillFragment({ fragment, item, index, name }) {
    // fragment - куда добавлять каждый itemClearfix
    // item - из листов arrIncome и arrExpenses
    // index - индекс по порядку
    // name - для понимания income или expenses

    const itemClearfix = document.createElement("div");
    const itemDescription = document.createElement("div");
    const itemValue = document.createElement("div");
    const iconEl = document.createElement("i");
    const deleteButton = document.createElement("button");
    const itemDeleteEl = document.createElement("div");
    const rightClearfixEl = document.createElement("div");

    itemClearfix.className = "item clearfix";
    itemClearfix.id = name + "-" + index;
    fragment.appendChild(itemClearfix);

    itemDescription.className = "item__description";
    itemDescription.innerText = item.desc;
    itemClearfix.appendChild(itemDescription);

     rightClearfixEl.className = "right clearfix";
     itemClearfix.appendChild(rightClearfixEl);

     itemValue.className = "item__value";
     itemValue.innerText = item.value;
     rightClearfixEl.appendChild(itemValue);

    iconEl.className = "ion-ios-close-outline";
    deleteButton.appendChild(iconEl);

    deleteButton.className = "item__delete--btn";
    // buttonEl.deleteIndex = index; ваще не то пальто - есть более подходящие атрибуты
    deleteButton.value = index;
    deleteButton.name = name
    deleteButton.addEventListener("click", onDeleteItemHandler);
    itemDeleteEl.appendChild(deleteButton);

    itemDeleteEl.className = "item__delete";
    rightClearfixEl.appendChild(itemDeleteEl);
}