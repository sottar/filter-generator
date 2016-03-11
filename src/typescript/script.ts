/// <reference path="../javascript/plugins/jquery.d.ts" />

$(function() {
  var value_unit = [
    { effects: 'blur', unit: 'px', value: '0', defaultVal: '0'},
    { effects: 'grayscale', unit: '%', value: '0', defaultVal: '0'},
    { effects: 'sepia', unit: '%', value: '0', defaultVal: '0'},
    { effects: 'saturate', unit: '%', value: '100', defaultVal: '100'},
    { effects: 'hue-rotate', unit: 'deg', value: '0', defaultVal: '0'},
    { effects: 'invert', unit: '%', value: '0', defaultVal: '0'},
    { effects: 'opacity', unit: '%', value: '100', defaultVal: '100'},
    { effects: 'brightness', unit: '%', value: '100', defaultVal: '100'},
    { effects: 'contrast', unit: '%', value: '100', defaultVal: '100'},
  ];
  var resultFilter: string = "";

  $('input[type="range"]').on('input', function() {
    setFilter($(this), this);
  });

  var setFilter = function(e, _this) {
    var effects: string = e.parents('.switch').attr('id'),
        unit: string = _this.dataset.unit || '',
        currentvalue: number = _this.value,
        currentValueText: string = currentvalue + unit;
    e.next('.current_val').text(currentValueText);
    $.each(value_unit, function() {
      if(this.effects == effects) {
        this.value = currentvalue;
      }
    });
    getResult();
    $('#image_after').css('filter', resultFilter);
    $('#image_after').css('-webkit-filter', resultFilter);
    $('#image_after').css('-moz-filter', resultFilter);
    $('#image_after').css('-o-filter', resultFilter);
    $('#image_after').css('-ms-filter', resultFilter);
  }

  $('#generate_button').on('click', function() {
    var returnVal: string = "";
    var returnPseudoBefore: string = "";
    var returnPseudoAfter: string = "";
    var filterVal: string = "";
    if(resultFilter != "") {
      filterVal = "#image_after {\n  filter: " + resultFilter + "\;\n  -webkit-filter: " + resultFilter + ";\n  -moz-filter: " + resultFilter + ";\n  -o-filter: " + resultFilter + ";\n  -ms-filter: " + resultFilter + ";\n}\n";
    }
    if(pseudo_elements[0].value != '') {
       returnPseudoBefore = pseudoBefore;
    }
    if(pseudo_elements[3].value != '') {
       returnPseudoAfter = pseudoAfter;
    }
    getResult();
    returnVal = filterVal + returnPseudoBefore + returnPseudoAfter;
    $('.css_area').val(returnVal);
  });

  function getResult() {
    resultFilter = "";
    var effectsLength = value_unit.length;
    for(var i = 0; i <= effectsLength-1; i++) {
      if(value_unit[i].value != value_unit[i].defaultVal) {
        resultFilter += value_unit[i].effects + '(' + value_unit[i].value + value_unit[i].unit + ') ';
      }
    }
  }

  // Pseudo-elements
  var pseudo_elements = [
    { effects: 'color1', value: '', defaultVal: ''},
    { effects: 'opacity1', value: '0.1', defaultVal: '0.1'},
    { effects: 'mix-blend-mode1', value: 'none', defaultVal: 'none'},
    { effects: 'color2', value: '', defaultVal: ''},
    { effects: 'opacity2', value: '0.1', defaultVal: '0.1'},
    { effects: 'mix-blend-mode2', value: 'none', defaultVal: 'none'}
  ];

  var resultColor: string = "",
      resultOpacity: string = "",
      resultMixBlend: string = "",
      pseudoBefore: string = "",
      pseudoAfter: string = "";

  isPseudoAbled();

    // colorが選択されていない時にはborderをつける
  $('.jscolor').on('change', function() {
    if($(this).val() == "") {
      $(this).addClass('on');
    } else {
      $(this).removeClass('on');
    }
  });

  $('.switch_color').find('.slider').on('input change', function() {
    pseudoBefore = "";
    pseudoAfter = "";
    resultMixBlend = "";
    resultColor = "";
    resultOpacity = "";
    $('style').remove();
    var _this = $(this);

    if(_this.attr('class').match(/jscolor/)) {
      getColor(_this);
    } else if (_this.attr('class').match(/mix_blend/)) {
      getMixBlend(_this);
    } else {
      getOpacity(_this);
    }
    setPseudoStyle();
  });

  function setPseudoStyle() {
    pseudoBefore =
    '#image_after::before {\n' +
      '  background: rgba(' + pseudo_elements[0].value + ',' + pseudo_elements[1].value + ');\n' +
      '  mix-blend-mode: ' + pseudo_elements[2].value+';\n' +
    '}\n';
    pseudoAfter =
    '#image_after::after {\n' +
      '  background: rgba(' + pseudo_elements[3].value + ',' + pseudo_elements[4].value + ');\n' +
      '  mix-blend-mode: ' + pseudo_elements[5].value+';\n' +
    '}\n';
    isPseudoAbled();
    $('body').prepend(
      '<style>\n' +
        pseudoBefore +
        pseudoAfter +
      '</style>'
    );
  }

  function isPseudoAbled() {
    $('.jscolor').each(function() {
      if( $(this).val() == '') {
        $(this).next('.slider').prop("disabled", true);
        $(this).parents('.switch_color').next('.switch_color').find('.mix_blend').prop("disabled", true);
      } else {
        $(this).next('.slider').prop("disabled", false);
        $(this).parents('.switch_color').next('.switch_color').find('.mix_blend').prop("disabled", false);
      }
    });
  }

  function getColor(e) {
    var color: string = e.val();
    toRGB(color);
    var target: string = e.attr('id');
    $.each(pseudo_elements, function() {
      if(this.effects == target) {
        this.value = resultColor;
      }
    });
  }

  function getOpacity(e) {
    if(e.prev('.jscolor').val() != '') {
      var currentVal: string = e.val(),
          target: string = e.attr('id');
      $.each(pseudo_elements, function() {
        if(this.effects == target) {
          this.value = currentVal;
        }
      });
      resultOpacity = currentVal;
    }
  }

  function getMixBlend(e) {
      var currentVal: string = "";
      if(e.parents('.switch_color').prev('.switch_color').children('.jscolor').val() != '') {
        var currentVal: string = e.val(),
            target: string = e.attr('id');
        $.each(pseudo_elements, function() {
          if(this.effects == target) {
            this.value = currentVal;
          }
        });
        resultMixBlend = currentVal;
      }

  }

  // convert from #xxxxxx to rgba()
  function toRGB(color16) {
    if(color16.match(/#/)) {
      color16 = color16.substr(1);
    }
    var array16 = new Array(),
        array10 = new Array();
    if(color16.length == 6) {
      for(var i=1; i<=3; i++) {
        array16[i-1] = color16.substr(2 * i - 2, 2);
      }
    } else if (color16.length == 3) {
      array16 = color16.split("");
    }
    for(var t=0; t<=2; t++) {
      array10[t] = parseInt(array16[t], 16);
    }
    resultColor = array10[0] + ',' + array10[1] + ',' + array10[2];
    return resultColor;
  }

  // show Detail Setting
  $('#recommend_btn').on('click', function() {
    var _this = $(this);
    if(_this.attr('class').match(/on/)) {
      _this.removeClass("on");
      $('.recommend_box').animate({
        height: 'hide',
        opacity: 'hide'
      });
      $('.triangle').html('&#9661;');
    } else {
      _this.addClass("on");
      $('.recommend_box').animate({
        height: 'show',
        opacity: 'show'
      });
      $('.triangle').html('&#9651;');
    }
  });

  var wrapRecommendsWidth: number = ($('.recommend_list').length + 1) * 100 / 2;
  $('.wrap_recommends').css('width', wrapRecommendsWidth);

  var currentFilterEffects = "";
  var currentPseudoEffects = "";
  // insta setting
  $('.recommend_image').on('click', function() {
    $('style').remove();
    var target = $(this);
    getCurrentEffects($(this))
    var effectsList = [];
    if(currentFilterEffects) {
      effectsList = currentFilterEffects.split(" ");
    }
    getInstaEffects($(this).attr('id'));
    setPseudoStyle();
    getResult();
    $('#image_after').css('filter', resultFilter);
    $('#image_after').css('-webkit-filter', resultFilter);
    $('#image_after').css('-moz-filter', resultFilter);
    $('#image_after').css('-o-filter', resultFilter);
    $('#image_after').css('-ms-filter', resultFilter);

    setValueToRange();
    isPseudoAbled();
  });

  function getCurrentEffects(target) {
    currentFilterEffects = "";
    if(target.css('filter') !=  "none") {
      currentFilterEffects = target.css('filter');
    } else if (target.css('-webkit-filter') != "none") {
      currentFilterEffects = target.css('-webkit-filter');
    } else if (target.css('-moz-filter') != "none") {
      currentFilterEffects = target.css('-moz-filter');
    } else if (target.css('-o-filter') != "none") {
      currentFilterEffects = target.css('-o-filter');
    } else if (target.css('-ms-filter') != "none") {
      currentFilterEffects = target.css('-ms-filter');
    }
    currentPseudoEffects = "";
  }

  function getInstaEffects(effectName) {
    var effectsPseudoLength = pseudo_elements.length;
    var effectsFilterLength = value_unit.length;
    for (var i = 0; i < effectsPseudoLength; i++) {
      pseudo_elements[i].value = pseudo_elements[i].defaultVal;
    }
    for (var i = 0; i < effectsFilterLength; i++) {
      value_unit[i].value = value_unit[i].defaultVal;
    }
    if (effectName == "aden"){
      pseudo_elements[0].value = toRGB('#e8e1e1');
      pseudo_elements[1].value = '1';
      pseudo_elements[2].value = 'darken';
      value_unit[3].value = '85';
      value_unit[4].value = '-20';
      value_unit[7].value = '120';
      value_unit[8].value = '90';
    } else if (effectName == "inkwell"){
      value_unit[1].value = '100';
      value_unit[2].value = '30';
      value_unit[7].value = '110';
      value_unit[8].value = '110';
    } else if (effectName == "reyes"){
      pseudo_elements[0].value = toRGB('efcdad');
      pseudo_elements[1].value = '0.5';
      pseudo_elements[2].value = 'soft-light';
      value_unit[2].value = '22';
      value_unit[3].value = '75';
      value_unit[7].value = '110';
      value_unit[8].value = '85';
    } else if (effectName == "gingham"){
      pseudo_elements[0].value = toRGB('#e8e1e1');
      pseudo_elements[1].value = '1';
      pseudo_elements[2].value = 'darken';
      value_unit[4].value = '-10';
      value_unit[7].value = '105';
    } else if (effectName == "toaster"){
      pseudo_elements[0].value = toRGB('#703a16');
      pseudo_elements[1].value = '1';
      pseudo_elements[2].value = 'screen';
      value_unit[7].value = '90';
      value_unit[8].value = '150';
    } else if (effectName == "walden"){
      pseudo_elements[0].value = toRGB('#0044cc');
      pseudo_elements[1].value = '0.3';
      pseudo_elements[2].value = 'screen';
      value_unit[2].value = '30';
      value_unit[3].value = '160';
      value_unit[4].value = '-10';
      value_unit[7].value = '110';
    } else if (effectName == "hudson"){
      pseudo_elements[0].value = toRGB('#969ce6');
      pseudo_elements[1].value = '1';
      pseudo_elements[2].value = 'multiply';
      value_unit[3].value = '110';
      value_unit[7].value = '120';
      value_unit[8].value = '90';
    } else if (effectName == "earlybird"){
      pseudo_elements[0].value = toRGB('#785141');
      pseudo_elements[1].value = '1';
      pseudo_elements[2].value = 'overlay';
      value_unit[2].value = '20';
      value_unit[8].value = '90';
    } else if (effectName == "mayfair"){
      pseudo_elements[0].value = toRGB('#948181');
      pseudo_elements[1].value = '1';
      pseudo_elements[2].value = 'overlay';
      value_unit[3].value = '110';
      value_unit[8].value = '110';
    } else if (effectName == "_1977"){
      pseudo_elements[0].value = toRGB('#f36abc');
      pseudo_elements[1].value = '0.3';
      pseudo_elements[2].value = 'screen';
      value_unit[3].value = '130';
      value_unit[7].value = '110';
      value_unit[8].value = '110';
    } else if (effectName == "brooklyn"){
      pseudo_elements[0].value = toRGB('#a3b9ad');
      pseudo_elements[1].value = '1';
      pseudo_elements[2].value = 'overlay';
      value_unit[7].value = '110';
      value_unit[8].value = '90';
    } else if (effectName == "xpro2"){
      pseudo_elements[0].value = toRGB('#d2d2db');
      pseudo_elements[1].value = '1';
      pseudo_elements[2].value = 'color-burn';
      value_unit[2].value = '30';
    } else if (effectName == "nashville"){
      pseudo_elements[0].value = toRGB('#960046');
      pseudo_elements[1].value = '0.4';
      pseudo_elements[2].value = 'lighten';
      pseudo_elements[3].value = toRGB('#9996B0');
      pseudo_elements[4].value = '0.56';
      value_unit[2].value = '20';
      value_unit[3].value = '120';
      value_unit[7].value = '105';
      value_unit[8].value = '120';
    } else if (effectName == "lark"){
      pseudo_elements[0].value = toRGB('#F2F2F2');
      pseudo_elements[1].value = '0.8';
      pseudo_elements[2].value = 'darken';
      pseudo_elements[3].value = toRGB('#22253f');
      pseudo_elements[4].value = '1';
      pseudo_elements[5].value = 'color-dodge';
      value_unit[8].value = '90';
    } else if (effectName == "moon"){
      pseudo_elements[0].value = toRGB('#a0a0a0');
      pseudo_elements[1].value = '1';
      pseudo_elements[2].value = 'soft-light';
      pseudo_elements[3].value = toRGB('#383838');
      pseudo_elements[4].value = '1';
      pseudo_elements[5].value = 'lighten';
      value_unit[1].value = '100';
      value_unit[7].value = '110';
      value_unit[8].value = '110';
    } else if (effectName == "clarendon"){
      pseudo_elements[0].value = toRGB('#227fbb');
      pseudo_elements[1].value = '0.2';
      pseudo_elements[2].value = 'overlay';
      value_unit[3].value = '135';
      value_unit[8].value = '120';
    } else if (effectName == "willow"){
      pseudo_elements[0].value = toRGB('#d4a9af');
      pseudo_elements[1].value = '1';
      pseudo_elements[2].value = 'overlay';
      pseudo_elements[3].value = toRGB('#d8cdcb');
      pseudo_elements[4].value = '1';
      pseudo_elements[5].value = 'color';
      value_unit[1].value = '50';
      value_unit[7].value = '90';
      value_unit[8].value = '95';
    } else if (effectName == "rise"){
      pseudo_elements[0].value = toRGB('#f0d8b8');
      pseudo_elements[1].value = '0.6';
      pseudo_elements[2].value = 'overlay';
      pseudo_elements[3].value = toRGB('#ede9e2');
      pseudo_elements[4].value = '1';
      pseudo_elements[5].value = 'multiply';
      value_unit[2].value = '20';
      value_unit[3].value = '90';
      value_unit[7].value = '105';
      value_unit[8].value = '90';
    } else if (effectName == "slumber"){
      pseudo_elements[0].value = toRGB('#693f18');
      pseudo_elements[1].value = '0.5';
      pseudo_elements[2].value = 'soft-light';
      pseudo_elements[3].value = toRGB('#45293d');
      pseudo_elements[4].value = '0.4';
      pseudo_elements[5].value = 'lighten';
      value_unit[3].value = '66';
      value_unit[7].value = '105';
    }
  }

  function setValueToRange() {
    // value unit
    var valueLength = value_unit.length;
    for (var i = 0; i < valueLength; i++) {
      var _thisEffectsId = '#' + value_unit[i].effects;
      $(_thisEffectsId).children('.slider').val(value_unit[i].value);
      $(_thisEffectsId).children('.current_val').text(value_unit[i].value + value_unit[i].unit);
    }
    // pseudo elements
    var pseudoLength = pseudo_elements.length;
    for (var i = 0; i < pseudoLength; i++) {
      var _thisEffectsId = '#' + pseudo_elements[i].effects;
      $(_thisEffectsId).val(pseudo_elements[i].value);
      if (i == 1 || i == 4) {
        $(_thisEffectsId).next('.current_val').text(pseudo_elements[i].value);
      }
    }
  }
});

$(function() {
  var target = $(".image_box, .recommend_image").find('img');
  $('input[type=file]').change(function() {
    var file = $(this).prop('files')[0];
    // 画像以外は処理を停止
    if (!file.type.match('image.*')) {
      $(this).val('');
      return;
    }

    // 画像表示
    var reader = new FileReader();
    reader.onload = function() {
      target.attr('src', reader.result);
    }
    reader.readAsDataURL(file);
  });
});