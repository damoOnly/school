var getSingle = function (fn) {
    var result;
    return function () {
        return result || (result = fn.apply(this, arguments));
    };
};

function extend(subType, superType) {
    function F() { };
    F.prototype = superType.prototype;

    var prototype = new F;
    prototype.constructor = subType;
    subType.prototype = prototype;
}

function Restaurant(dishes, seatNum, employeesList) {
    this.dishes = dishes;
    this.seatNum = seatNum;
    this.employeesList = employeesList;
}

Restaurant.prototype.recruitmentEmployee = function (employee) {
    this.employeesList.push(employee);
}

Restaurant.prototype.seatting = function (customer) {
    this.seatNum++;
    console.log(`seat: ${this.seatNum}`);
    var dish =  this.employeesList[1].orderDishes(customer, this.employeesList[0].cook);
    customer.eat(dish);    
}

Restaurant.prototype.leave = function () {
    this.seatNum--;
    console.log(`seat: ${this.seatNum}`);
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

function Waiter(id, name, wages) {
    Employee.call(this, id, name, wages);
}

extend(Waiter, Employee);

Waiter.prototype.orderDishes = function (customer, cook) {
    console.log('waiter order dish');
    var dishName = customer.order();
    var dish = cook(dishName, this.takeDishes);
    return dish;
}

Waiter.prototype.takeDishes = function (dish) {
    console.log('take dish'); 
    return dish;   
}

function Chef(id, name, wages) {
    Employee.call(this, id, name, wages);
}

extend(Chef, Employee);

Chef.prototype.cook = function (dishName, takeDishes) {
    console.log('cooking');
    return takeDishes(dishName);
}

function Customer(dishes) {
    this.dishes = dishes;
}

Customer.prototype.order = function () {
    console.log('customer ordering');
    return this.dishes.name;
}

Customer.prototype.eat = function (dish) {
    console.log(`eatting: ${dish}`);
}

function Dishes(name, cost, price) {
    this.name = name;
    this.cost = cost;
    this.price = price;
}

var restaurant = new Restaurant(null, 0, []);

var creatChef = getSingle(function (id, name, wages) {
    return new Chef(id, name, wages);
});

var chef = creatChef(0, 'chef', 50);

var waiter = getSingle(function (id, name, wages) {
    return new Waiter(id, name, wages);
})(1, 'waiter', 10);

restaurant.recruitmentEmployee(chef);
restaurant.recruitmentEmployee(waiter);

var customer1 = new Customer(new Dishes('fish', 15, 30));
restaurant.seatting(customer1);
restaurant.leave();

var customer2 = new Customer(new Dishes('beach', 15, 30));
restaurant.seatting(customer2);
restaurant.leave();
