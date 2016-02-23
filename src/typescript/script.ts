/// <reference path="../javascript/definitions/jquery.d.ts" />

$(function() {
  var value_unit = [
    { effects: 'blur', unit: 'px', value: 0, defaultVal: 0},
    { effects: 'grayscale', unit: '%', value: 0, defaultVal: 0},
    { effects: 'sepia', unit: '%', value: 0, defaultVal: 0},
    { effects: 'saturate', unit: '%', value: 100, defaultVal: 100},
    { effects: 'hue-rotate', unit: 'deg', value: 0, defaultVal: 0},
    { effects: 'invert', unit: '%', value: 0, defaultVal: 0},
    { effects: 'opacity', unit: '%', value: 100, defaultVal: 100},
    { effects: 'brightness', unit: '%', value: 100, defaultVal: 100},
    { effects: 'contrast', unit: '%', value: 100, defaultVal: 100}
  ];
  var result: string = "";

  $('input[type="range"]').on('change', function() {
    setFilter($(this), this);
  });

  var setFilter = function(e, _this) {
    var effects: string = e.parents('.switch').attr('id'); 
    var unit: string = _this.dataset.unit || '%';
    var currentvalue: number = _this.value;
    var currentValueText: string = currentvalue + unit;
    e.next('.current_val').text(currentValueText);
    $.each(value_unit, function() {
      if(this.effects == effects) {
        this.value = currentvalue;
      }
    });
    getResult();
    $('#image_after').css('filter', result);
    $('#image_after').css('-webkit-filter', result);
    $('#image_after').css('-moz-filter', result);
    $('#image_after').css('-o-filter', result);
    $('#image_after').css('-ms-filter', result);
  }

  $('#generate_button').on('click', function() {
    var returnVal: string = "";
    getResult();
    returnVal = ".after_image {\n  filter: " + result + "\;\n  -webkit-filter: " + result + ";\n  -moz-filter: " + result + ";\n  -o-filter: " + result + ";\n  -ms-filter: " + result + ";\n}";
    $('.css_area').val(returnVal);
  });

  function getResult() {
    result = "";
    var effectsLength = value_unit.length;
    for(var i = 0; i <= effectsLength-1; i++) {
      if(value_unit[i].value != value_unit[i].defaultVal) {
        result += value_unit[i].effects + '(' + value_unit[i].value + value_unit[i].unit + ') ';
      }
    }
  }
});
