/// <reference path="../javascript/plugins/jquery.d.ts" />
$(function () {
    var value_unit = [
        { effects: 'blur', unit: 'px', value: '0', defaultVal: '0' },
        { effects: 'grayscale', unit: '%', value: '0', defaultVal: '0' },
        { effects: 'sepia', unit: '%', value: '0', defaultVal: '0' },
        { effects: 'saturate', unit: '%', value: '100', defaultVal: '100' },
        { effects: 'hue-rotate', unit: 'deg', value: '0', defaultVal: '0' },
        { effects: 'invert', unit: '%', value: '0', defaultVal: '0' },
        { effects: 'opacity', unit: '%', value: '100', defaultVal: '100' },
        { effects: 'brightness', unit: '%', value: '100', defaultVal: '100' },
        { effects: 'contrast', unit: '%', value: '100', defaultVal: '100' },
    ];
    var resultFilter = "";
    $('input[type="range"]').on('input', function () {
        setFilter($(this), this);
    });
    var setFilter = function (e, _this) {
        var effects = e.parents('.switch').attr('id'), unit = _this.dataset.unit || '', currentvalue = _this.value, currentValueText = currentvalue + unit;
        e.next('.current_val').text(currentValueText);
        $.each(value_unit, function () {
            if (this.effects == effects) {
                this.value = currentvalue;
            }
        });
        getResult();
        $('#image_after').css('filter', resultFilter);
        $('#image_after').css('-webkit-filter', resultFilter);
        $('#image_after').css('-moz-filter', resultFilter);
        $('#image_after').css('-o-filter', resultFilter);
        $('#image_after').css('-ms-filter', resultFilter);
    };
    $('#generate_button').on('click', function () {
        var returnVal = "";
        var returnPseudoBefore = "";
        var returnPseudoAfter = "";
        var filterVal = "";
        if (resultFilter != "") {
            filterVal = "#image_after {\n  filter: " + resultFilter + "\;\n  -webkit-filter: " + resultFilter + ";\n  -moz-filter: " + resultFilter + ";\n  -o-filter: " + resultFilter + ";\n  -ms-filter: " + resultFilter + ";\n}\n";
        }
        if (pseudo_elements[0].value != '') {
            returnPseudoBefore = pseudoBefore;
        }
        if (pseudo_elements[3].value != '') {
            returnPseudoAfter = pseudoAfter;
        }
        getResult();
        returnVal = filterVal + returnPseudoBefore + returnPseudoAfter;
        $('.css_area').val(returnVal);
    });
    function getResult() {
        resultFilter = "";
        var effectsLength = value_unit.length;
        for (var i = 0; i <= effectsLength - 1; i++) {
            if (value_unit[i].value != value_unit[i].defaultVal) {
                resultFilter += value_unit[i].effects + '(' + value_unit[i].value + value_unit[i].unit + ') ';
            }
        }
    }
    // Pseudo-elements
    var pseudo_elements = [
        { effects: 'color1', value: '', defaultVal: '' },
        { effects: 'opacity1', value: '0.1', defaultVal: '0.1' },
        { effects: 'mix-blend-mode1', value: 'none', defaultVal: 'none' },
        { effects: 'color2', value: '', defaultVal: '' },
        { effects: 'opacity2', value: '0.1', defaultVal: '0.1' },
        { effects: 'mix-blend-mode2', value: 'none', defaultVal: 'none' }
    ];
    var resultColor = "", resultOpacity = "", resultMixBlend = "", pseudoBefore = "", pseudoAfter = "";
    isPseudoAbled();
    // colorが選択されていない時にはborderをつける
    $('.jscolor').on('change', function () {
        if ($(this).val() == "") {
            $(this).addClass('on');
        }
        else {
            $(this).removeClass('on');
        }
    });
    $('.switch_color').find('.slider').on('input change', function () {
        pseudoBefore = "";
        pseudoAfter = "";
        resultMixBlend = "";
        resultColor = "";
        resultOpacity = "";
        $('style').remove();
        var _this = $(this);
        if (_this.attr('class').match(/jscolor/)) {
            getColor(_this);
        }
        else if (_this.attr('class').match(/mix_blend/)) {
            getMixBlend(_this);
        }
        else {
            getOpacity(_this);
        }
        if (pseudo_elements[0].value != '') {
            pseudoBefore =
                '#image_after::before {\n' +
                    '  background: rgba(' + pseudo_elements[0].value + ',' + pseudo_elements[1].value + ');\n' +
                    '  mix-blend-mode: ' + pseudo_elements[2].value + ';\n' +
                    '}\n';
        }
        if (pseudo_elements[3].value != '') {
            pseudoAfter =
                '#image_after::after {\n' +
                    '  background: rgba(' + pseudo_elements[3].value + ',' + pseudo_elements[4].value + ');\n' +
                    '  mix-blend-mode: ' + pseudo_elements[5].value + ';\n' +
                    '}\n';
        }
        isPseudoAbled();
        $('body').prepend('<style>\n' +
            pseudoBefore +
            pseudoAfter +
            '</style>');
    });
    function isPseudoAbled() {
        $('.jscolor').each(function () {
            if ($(this).val() == '') {
                $(this).next('.slider').prop("disabled", true);
                $(this).parents('.switch_color').next('.switch_color').find('.mix_blend').prop("disabled", true);
            }
            else {
                $(this).next('.slider').prop("disabled", false);
                $(this).parents('.switch_color').next('.switch_color').find('.mix_blend').prop("disabled", false);
            }
        });
    }
    function getColor(e) {
        var color = e.val();
        toRGB(color);
        var target = e.attr('id');
        $.each(pseudo_elements, function () {
            if (this.effects == target) {
                this.value = resultColor;
            }
        });
    }
    function getOpacity(e) {
        if (e.prev('.jscolor').val() != '') {
            var currentVal = e.val(), target = e.attr('id');
            $.each(pseudo_elements, function () {
                if (this.effects == target) {
                    this.value = currentVal;
                }
            });
            resultOpacity = currentVal;
        }
    }
    function getMixBlend(e) {
        var currentVal = "";
        if (e.parents('.switch_color').prev('.switch_color').children('.jscolor').val() != '') {
            var currentVal = e.val(), target = e.attr('id');
            $.each(pseudo_elements, function () {
                if (this.effects == target) {
                    this.value = currentVal;
                }
            });
            resultMixBlend = currentVal;
        }
    }
    // convert from #xxxxxx to rgba()
    function toRGB(color16) {
        if (color16.match(/#/)) {
            color16 = color16.substr(1);
        }
        var array16 = new Array(), array10 = new Array();
        if (color16.length == 6) {
            for (var i = 1; i <= 3; i++) {
                array16[i - 1] = color16.substr(2 * i - 2, 2);
            }
        }
        else if (color16.length == 3) {
            array16 = color16.split("");
        }
        for (var t = 0; t <= 2; t++) {
            array10[t] = parseInt(array16[t], 16);
        }
        resultColor = array10[0] + ',' + array10[1] + ',' + array10[2];
    }
    // show Blend Mode
    $('#blend_mode_btn').on('click', function () {
        var _this = $(this);
        if (_this.attr('class').match(/on/)) {
            _this.removeClass("on");
            $('.blend_mode_block').animate({
                height: 'hide',
                opacity: 'hide'
            });
        }
        else {
            _this.addClass("on");
            $('.blend_mode_block').animate({
                height: 'show',
                opacity: 'show'
            });
        }
    });
    var wrapRecommendsWidth = ($('.recommend_list').length + 1) * 100 / 2;
    $('.wrap_recommends').css('width', wrapRecommendsWidth);
    $('.recommend_image_wrap').on('click', function () {
        var target = $(this).children('.recommend_image');
        var instaName = $(this).children('.recommend_image').attr('id');
        var currentEffects = "";
        if (target.css('filter') != "none") {
            currentEffects = target.css('filter');
        }
        else if (target.css('-webkit-filter') != "none") {
            currentEffects = target.css('-webkit-filter');
        }
        else if (target.css('-moz-filter') != "none") {
            currentEffects = target.css('-moz-filter');
        }
        else if (target.css('-o-filter') != "none") {
            currentEffects = target.css('-o-filter');
        }
        else if (target.css('-ms-filter') != "none") {
            currentEffects = target.css('-ms-filter');
        }
        var effectsList = [];
        if (currentEffects) {
            effectsList = currentEffects.split(" ");
        }
    });
});
