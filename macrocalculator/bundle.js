(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculate = void 0;
var TDEE_MULTIPLIER = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "very": 1.725,
    "extremely": 1.9
};
function calculate(inputs) {
    var base_bmr = 10 * lbs_to_kg(inputs.weight_lbs) + 6.25 * inputs.height_cm - 5 * inputs.age_yrs;
    var bmr = inputs.sex == "male" ? base_bmr + 5 : base_bmr - 161;
    var tdee = bmr * TDEE_MULTIPLIER[inputs.energy_lvl];
    var tdee_weightloss = 0.85 * tdee;
    return {
        maintenance: calculate_daily_nutrients(inputs.sex, tdee, inputs.weight_lbs),
        weight_loss: calculate_daily_nutrients(inputs.sex, tdee_weightloss, inputs.weight_lbs),
    };
}
exports.calculate = calculate;
function calculate_daily_nutrients(sex, daily_cals, weight_lbs) {
    var protein = 0.8 * weight_lbs;
    var fiber = sex == "male" ? 38 : 25;
    var fat_cals = 0.3 * daily_cals;
    var carbs = daily_cals - (protein * 4 + fat_cals);
    return {
        protein_g: protein,
        carbs_g: carbs / 4,
        fat_g: fat_cals / 9,
        fiber_g: fiber,
        daily_cals: daily_cals,
    };
}
function lbs_to_kg(lbs) {
    return lbs / 2.2;
}

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSubmit = void 0;
var calc_1 = require("./calc");
function run_validation(v, f) {
    var obj = {};
    var k;
    var success = true;
    for (k in v) {
        var r = v[k]();
        if (r) {
            obj[k] = r.ok;
        }
        else {
            success = false;
        }
    }
    if (success) {
        f(obj);
    }
    return success;
}
function reset_errors(widget_id) {
    document.getElementById(widget_id).classList.remove("error");
}
function set_error(widget_id) {
    document.getElementById(widget_id).classList.add("error");
}
function validate_gender(form) {
    reset_errors("gender-widget");
    var gender = form.querySelector("input[name=gender]:checked");
    if (!gender || (gender.id != "male" && gender.id != "female")) {
        set_error("gender-widget");
        return null;
    }
    return { ok: gender.id };
}
function validate_weight(form) {
    reset_errors("weight-widget");
    var weightString = form.get("weight-lbs");
    if (weightString == "") {
        set_error("weight-widget");
        return null;
    }
    var weight = parseInt(weightString);
    if (weight < 50 || weight > 700) {
        set_error("weight-widget");
        return null;
    }
    return { ok: weight };
}
function validate_age(form) {
    reset_errors("age-widget");
    var ageString = form.get("age-yrs");
    if (ageString == "") {
        set_error("age-widget");
        return null;
    }
    var age = parseInt(ageString);
    if (age < 10 || age > 150) {
        set_error("age-widget");
        return null;
    }
    return { ok: age };
}
function onSubmit(event, render_outputs) {
    event.preventDefault();
    var form = document.getElementById("macro-calc-form");
    var output_area = document.getElementById("macro-calc-output");
    var data = new FormData(form);
    var height_cm = (parseInt(data.get("height-ft")) * 12 +
        parseInt(data.get("height-inch"))) *
        2.54;
    while (output_area.hasChildNodes()) {
        output_area.removeChild(output_area.firstChild);
    }
    run_validation({
        weight: function () { return validate_weight(data); },
        age: function () { return validate_age(data); },
        gender: function () { return validate_gender(form); },
    }, function (validated_data) {
        var inputs = {
            sex: validated_data.gender,
            weight_lbs: validated_data.weight,
            height_cm: height_cm,
            age_yrs: validated_data.age,
            energy_lvl: data.get("energy-lvl"),
        };
        var outputs = (0, calc_1.calculate)(inputs);
        output_area.appendChild(render_outputs(outputs));
        output_area.scrollIntoView({ behavior: 'smooth' });
    });
}
exports.onSubmit = onSubmit;

},{"./calc":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calculator = void 0;
var jsx_1 = require("./jsx");
var calc_form_1 = require("./calc_form");
var render_outputs = function (outputs) { return ((0, jsx_1.createElement)("div", { class: "outputs" },
    (0, jsx_1.createElement)("div", null,
        (0, jsx_1.createElement)("h1", null, "Maintenance"),
        render_daily_nutrients(outputs.maintenance)),
    (0, jsx_1.createElement)("div", null,
        (0, jsx_1.createElement)("h1", null, "Weight Loss"),
        render_daily_nutrients(outputs.weight_loss)))); };
var render_daily_nutrients = function (daily_nutrients) { return ((0, jsx_1.createElement)("div", { class: "daily-nutrients" },
    (0, jsx_1.createElement)("div", { class: "daily-calories" },
        (0, jsx_1.createElement)("div", { class: "label" }, "Daily Calories"),
        (0, jsx_1.createElement)("div", { class: "value" }, daily_nutrients.daily_cals.toFixed())),
    (0, jsx_1.createElement)("h2", null, "Daily Macronutrients"),
    (0, jsx_1.createElement)("div", null,
        (0, jsx_1.createElement)("div", { class: "label" }, "Protein: "),
        (0, jsx_1.createElement)("div", { class: "value" },
            daily_nutrients.protein_g.toFixed(),
            "g")),
    (0, jsx_1.createElement)("div", null,
        (0, jsx_1.createElement)("div", { class: "label" }, "Carbs: "),
        (0, jsx_1.createElement)("div", { class: "value" },
            daily_nutrients.carbs_g.toFixed(),
            "g")),
    (0, jsx_1.createElement)("div", null,
        (0, jsx_1.createElement)("div", { class: "label" }, "Fat: "),
        (0, jsx_1.createElement)("div", { class: "value" },
            daily_nutrients.fat_g.toFixed(),
            "g")),
    (0, jsx_1.createElement)("div", null,
        (0, jsx_1.createElement)("div", { class: "label" }, "Fiber: "),
        (0, jsx_1.createElement)("div", { class: "value" },
            daily_nutrients.fiber_g.toFixed(),
            "g")))); };
var Calculator = function () { return ((0, jsx_1.createElement)("div", { class: "macro-calc-container" },
    (0, jsx_1.createElement)("h1", { class: "title" }, "Feel Your Best Formula"),
    (0, jsx_1.createElement)("h2", { class: "subtitle" }, "Macro Calorie Calculator by Lilias Lewis"),
    (0, jsx_1.createElement)("img", { class: "profile-pic", src: "https://lifewithliias.github.io/assets/profile_pic.png" }),
    (0, jsx_1.createElement)("form", { onSubmit: function (e) { return (0, calc_form_1.onSubmit)(e, render_outputs); }, id: "macro-calc-form" },
        (0, jsx_1.createElement)("div", { id: "gender-widget", class: "widget" },
            (0, jsx_1.createElement)("label", { for: "gender" }, "Gender: "),
            (0, jsx_1.createElement)("div", null,
                (0, jsx_1.createElement)("input", { type: "radio", id: "male", name: "gender" }),
                (0, jsx_1.createElement)("label", { for: "male" }, "Male")),
            (0, jsx_1.createElement)("div", null,
                (0, jsx_1.createElement)("input", { type: "radio", id: "female", name: "gender" }),
                (0, jsx_1.createElement)("label", { for: "female" }, "Female"))),
        (0, jsx_1.createElement)("div", { id: "height-widget", class: "widget" },
            (0, jsx_1.createElement)("label", null, "Height: "),
            (0, jsx_1.createElement)("div", null,
                (0, jsx_1.createElement)("select", { id: "height-ft", name: "height-ft" },
                    (0, jsx_1.createElement)("option", { value: "2" }, "2"),
                    (0, jsx_1.createElement)("option", { value: "3" }, "3"),
                    (0, jsx_1.createElement)("option", { value: "4" }, "4"),
                    (0, jsx_1.createElement)("option", { value: "5", selected: true }, "5"),
                    (0, jsx_1.createElement)("option", { value: "6" }, "6"),
                    (0, jsx_1.createElement)("option", { value: "7" }, "7"),
                    (0, jsx_1.createElement)("option", { value: "8" }, "8"),
                    (0, jsx_1.createElement)("option", { value: "9" }, "9")),
                (0, jsx_1.createElement)("label", { for: "height-ft" }, "ft.")),
            (0, jsx_1.createElement)("div", null,
                (0, jsx_1.createElement)("select", { id: "height-inch", name: "height-inch" },
                    (0, jsx_1.createElement)("option", { value: "0" }, "0"),
                    (0, jsx_1.createElement)("option", { value: "1" }, "1"),
                    (0, jsx_1.createElement)("option", { value: "2" }, "2"),
                    (0, jsx_1.createElement)("option", { value: "3" }, "3"),
                    (0, jsx_1.createElement)("option", { value: "4" }, "4"),
                    (0, jsx_1.createElement)("option", { value: "5", selected: true }, "5"),
                    (0, jsx_1.createElement)("option", { value: "6" }, "6"),
                    (0, jsx_1.createElement)("option", { value: "7" }, "7"),
                    (0, jsx_1.createElement)("option", { value: "8" }, "8"),
                    (0, jsx_1.createElement)("option", { value: "9" }, "9"),
                    (0, jsx_1.createElement)("option", { value: "10" }, "10"),
                    (0, jsx_1.createElement)("option", { value: "11" }, "11"),
                    (0, jsx_1.createElement)("option", { value: "12" }, "12")),
                (0, jsx_1.createElement)("label", { for: "height-inch" }, "in."))),
        (0, jsx_1.createElement)("div", { id: "weight-widget", class: "widget" },
            (0, jsx_1.createElement)("label", { for: "weight-lbs" }, "Weight: "),
            (0, jsx_1.createElement)("div", null,
                (0, jsx_1.createElement)("input", { type: "number", id: "weight-lbs", name: "weight-lbs" }),
                (0, jsx_1.createElement)("label", { for: "weight-lbs" }, "lbs."))),
        (0, jsx_1.createElement)("div", { id: "age-widget", class: "widget" },
            (0, jsx_1.createElement)("label", { for: "age-yrs" }, "Age: "),
            (0, jsx_1.createElement)("input", { type: "number", id: "age-yrs", name: "age-yrs" })),
        (0, jsx_1.createElement)("div", { class: "widget" },
            (0, jsx_1.createElement)("label", { for: "energy-lvl" }, "Activity Level: "),
            (0, jsx_1.createElement)("select", { id: "energy-lvl", name: "energy-lvl" },
                (0, jsx_1.createElement)("option", { value: "sedentary" }, "< 3000 steps per day, no workouts"),
                (0, jsx_1.createElement)("option", { value: "light" }, "3000-5000 steps per day, 1-2 light workouts per week"),
                (0, jsx_1.createElement)("option", { value: "moderate" }, "5000- 10,000 steps per day, 3-5 moderate workouts per week"),
                (0, jsx_1.createElement)("option", { value: "very" }, "10,000-20,000 steps per day, 6-7 heavy workouts per week"),
                (0, jsx_1.createElement)("option", { value: "extremely" }, "20,000+ steps per day, 7+ workouts per week"))),
        (0, jsx_1.createElement)("div", { class: "flex flex-row" },
            (0, jsx_1.createElement)("button", { class: "mx-auto submit-btn", type: "submit" },
                (0, jsx_1.createElement)("i", { class: "material-icons", style: "font-size: 36px;" }, "calculate"),
                (0, jsx_1.createElement)("span", null, "Calculate")))),
    (0, jsx_1.createElement)("div", { id: "macro-calc-output" }))); };
exports.Calculator = Calculator;

},{"./calc_form":2,"./jsx":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var calc_ui_1 = require("./calc_ui");
document.getElementById("macro-calc").appendChild((0, calc_ui_1.Calculator)());

},{"./calc_ui":3}],5:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFragment = exports.createElement = void 0;
var createElement = function (tag, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if (typeof tag === "function")
        return tag.apply(void 0, __spreadArray([props], __read(children), false));
    var element = document.createElement(tag);
    Object.entries(props || {}).forEach(function (_a) {
        var _b = __read(_a, 2), name = _b[0], value = _b[1];
        if (name.startsWith("on") && name.toLowerCase() in window)
            element.addEventListener(name.toLowerCase().substr(2), value);
        else
            element.setAttribute(name, value.toString());
    });
    children.forEach(function (child) {
        appendChild(element, child);
    });
    return element;
};
exports.createElement = createElement;
var appendChild = function (parent, child) {
    if (Array.isArray(child))
        child.forEach(function (nestedChild) { return appendChild(parent, nestedChild); });
    else
        parent.appendChild(child.nodeType ? child : document.createTextNode(child));
};
var createFragment = function (_) {
    var children = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        children[_i - 1] = arguments[_i];
    }
    return children;
};
exports.createFragment = createFragment;

},{}]},{},[1,2,3,4,5]);
