//继承原型
function extend(subType, superType) {
    function F(){};
    F.prototype = superType.prototype;
 
    var prototype = new F;
    prototype.constructor = subType;
    subType.prototype = prototype;
  }

function Restaurant(money, seatNum, employeesList) {
    this.money = money;
    this.seatNum = seatNum;
    this.employeesList = employeesList;
}

Restaurant.prototype.recruitmentEmployee = function (employee) {
    this.employeesList.push(employee);
}

Restaurant.prototype.firedEmployee = function (employee) {
    var index = this.employeesList.findIndex(function (item) {
        return item === employee;
    });
    this.employeesList.splice(index, 1);
}

function Employee(id, name, wages) {
    this.id = id;
    this.name = name;
    this.wages = wages;
}

Employee.prototype.doWork = function () {
    console.log('do work');
}

function Waiter(id, name, wages) {
    Employee.call(this, id, name, wages);
}

extend(Waiter, Employee);

Waiter.prototype.doWork = function (work) {
    if (work instanceof Array) {
        console.log('dian cai');
    } else {
        console.log('shang cai');
    }
}

function Chef(id, name, wages) {
    Employee.call(this, id, name, wages);    
}

extend(Chef, Employee);

Chef.prototype.doWork = function () {
    console.log('cook');
}

function Customer() {}

Customer.prototype.order = function () {

}

Customer.prototype.eat = function () {
    
}

function Dishes(name, cost, price) {
    this.name = name;
    this.cost = cost;
    this.price = price;
}


