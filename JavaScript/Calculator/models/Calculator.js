/**
 * Created by Kamen on 30.3.2017 г..
 */
function Calculator(leftOperand, operator, rightOperand){
    this.leftOperand = leftOperand;
    this.operator = operator;
    this.rightOperand = rightOperand;

    this.calculateResult = function(){
        let result = 0;
        switch(this.operator){
            case "+":
                result = this.leftOperand + this.rightOperand;
                break;
            case "-":
                result = this.leftOperand - this.rightOperand;
                break;
            case "*":
                result = this.leftOperand * this.rightOperand;
                break;
            case "/":
                result = this.leftOperand / this.rightOperand;
                break;
        }

        return result;
    };
}

module.exports = Calculator;