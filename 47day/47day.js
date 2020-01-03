function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}



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

function Restaurant(dishList, seatNum, employeesList) {
    this.dishList = dishList;
    this.seatNum = seatNum;
    this.employeesList = employeesList;
}

Restaurant.prototype.recruitmentEmployee = function (employee) {
    this.employeesList.push(employee);
}

Restaurant.prototype.seatting = function (customer) {
    this.seatNum++;
    console.log(`seat: ${this.seatNum}, ${customer.name}`);
    var ch = this.employeesList[0];
    var wt = this.employeesList[1];
    // console.log(this.dishList);
    // var p = new Promise(function (resolve, reject) {
    //     console.log(this);
    //     resolve(this.dishList);
    // });
    // p
    // .then(wt.orderDishes)
    wt.orderDishes(this.dishList)
    .then(customer.order)
    .then(wt.takeDishesToChef)
    .then(function(dishes) {
        // var ap = [];
        // for (var i = 0, cc=dishes.length; i < cc;i++) {
        //     var tp = ch.cook(dishes[i])
        //     .then(wt.takeDishes);
        //     ap.push(tp);
        // }
        // return new Promise(function (resolve, reject) {
        //     Promise.all(ap).then(function () {
        //         resolve(dishes);
        //     });            
        // });
        return dishes.reduce(function (promise, task) {
            return promise.then(function () { return ch.cook(task); }).then(wt.takeDishes);
        }, Promise.resolve()).then(function () {
            return dishes;
        });
    })
    .then(customer.eat)
    .then(this.leave.bind(this));
    // var dish =  this.employeesList[1].orderDishes(customer, this.employeesList[0].cook, this.dishList);
    // customer.eat(dish);    
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

Waiter.prototype.orderDishes = function (dishes) {
    console.log('waiter order dish');
    return new Promise(function (resolve, reject) {
        resolve(dishes);
    });
}

Waiter.prototype.takeDishesToChef = function (dishes) {
    console.log('waiter take dishes to Chef');
    return new Promise(function (resolve, reject) {
        resolve(dishes);
    });
}

Waiter.prototype.takeDishes = function (dish) {
    console.log(`take dish: ${dish.name}`); 
    return new Promise(function (resolve, reject) {
        resolve(dish);
    });   
}

function Chef(id, name, wages) {
    Employee.call(this, id, name, wages);
}

extend(Chef, Employee);

Chef.prototype.cook = function (dish) {
    console.log(`cooking: ${dish.name}`);
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, dish.timeRange * 1000, dish);
    });
}

function Customer(name) {
    this.name = name;
}

Customer.prototype.order = function (dishes) {
    console.log('customer ordering');
    return new Promise(function (resolve, reject) {
        // var count = getRandomInt(1, 3);
        var count = 2;
        var nld = [];
        for (var i = 0; i < count; i++) {
            var index = getRandomInt(0, 5);
            nld.push(dishes[index]);
        }
        setTimeout(resolve, 3*1000, nld);
    });
}

Customer.prototype.eat = function (dishes) {
    console.log(`eatting: ${dishes.length}`);
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, 4*1000);
    });
}

function Dishes(name, cost, price, timeRange) {
    this.name = name;
    this.cost = cost;
    this.price = price;
    this.timeRange = timeRange; // s
}

var dl = [new Dishes('fish', 15, 30, 2),
new Dishes('fish1', 15, 30, 3),
new Dishes('fish2', 15, 30, 4),
new Dishes('fish3', 15, 30, 5),
new Dishes('fish4', 15, 30, 6),
new Dishes('fish5', 15, 30, 7)];

var restaurant = new Restaurant(dl, 0, []);

var creatChef = getSingle(function (id, name, wages) {
    return new Chef(id, name, wages);
});

var chef = creatChef(0, 'chef', 50);

var waiter = getSingle(function (id, name, wages) {
    return new Waiter(id, name, wages);
})(1, 'waiter', 10);

restaurant.recruitmentEmployee(chef);
restaurant.recruitmentEmployee(waiter);

var customer1 = new Customer('Kim');
restaurant.seatting(customer1);
// restaurant.leave();

// var customer2 = new Customer(new Dishes('beach', 15, 30));
// restaurant.seatting(customer2);
// restaurant.leave();
