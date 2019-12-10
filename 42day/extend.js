//继承原型
function extend(subType, superType) {
    function F(){};
    F.prototype = superType.prototype;
 
    var prototype = new F;
    prototype.constructor = subType;
    subType.prototype = prototype;
  }
 
  //超类方法
  function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
  }
  SuperType.prototype.sayName = function() {
    return this.name;
  }
 
  //子类方法
  function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
  }
 
  //继承超类的原型
  extend(SubType, SuperType);
 
  //子类方法
  SubType.prototype.sayAge = function() {
    return this.age;
  }
 
  var instance1 = new SubType("Shelby");
  var instance2 = new SubType("Court", 28);
 
  instance1.colors.push('black');
 
  alert(instance1.colors); //red,blue,green,black
  alert(instance2.colors); //red,blue,green
 
  alert(instance1 instanceof SubType); //true
  alert(instance1 instanceof SuperType); //true