function activatePanel(panel, updateHash, forward) {
    if (shownFlash) {
        $('.flash').hide();
    }
    shownFlash = true;
    $('.panel').hide().removeClass('current');
    panel.show().addClass('current');

    panel.trigger("panelChange");

    //If panel has no visible questions, skip to the next or previous panel based on 'forward'
    if (panel.is(".noVisibleQuestions")) {
        if (forward) {
            return activatePanel(panel.next(), updateHash, true);
        } else {
            return activatePanel(panel.prev(), updateHash, false);
        }
    }

    if (updateHash)
        changeHash(panel[0].id);
    window.scrollTo(0,0);

    nextButtonFocussed = false;
    saveButtonFocussed = false;
    curPanel = panel;
    if (hotkeysEnabled) {
        panelInputs = getValidInputs();
        focusI = 1;
        focusInputIndex(focusI, true);
    }
}

//This function is set to the onClick of the 'check_all' and the 'uncheck_all' checkboxes, with checkValue set
// to "1" and "0" respectively
function setAllCheckboxes(checked, allKey, nothingKey, question, checkValue){
    if(checked){
        // Setting all other checkboxes to checkValue
        check_boxes = $("#answer_"+question+"_input").find("input[type=checkbox]:not(:disabled)")
        if(check_boxes.length == 0){
            check_boxes = $("[data-for='"+question+"']").find("input[type=checkbox]:not(:disabled)")
        }
        for (i = 0; i < check_boxes.length; i++) {
          if (check_boxes[i].id != "answer_"+nothingKey && check_boxes[i].id != "answer_"+allKey){
            $(check_boxes[i]).attr("checked", checkValue);
            if (checkValue) {
                $(check_boxes[i]).attr("checked", checkValue);
            } else {
                $(check_boxes[i]).removeAttr("checked");
            }
            handleDisableCheckboxSubQuestions(check_boxes[i]);
          }
        }

        // Setting the 'check_all' and the 'uncheck_all' checkboxes appropriately, if both are used
        correctAllNothingCheckboxes(checkValue == "checked", allKey, nothingKey);
    }
}

//This function is set to the onClick of all checkboxes besides the 'check_all' or 'uncheck_all' checkboxes
//to appropriately set the 'check_all' or 'uncheck_all' checkboxes if a checkbox changes
//1: If a checkbox is checked, the 'uncheck_all' checkbox should be unchecked
//2: If a checkbox is unchecked, the 'check_all' checkbox should be unchecked
function correctAllNothingCheckboxes(checked, allKey, nothingKey){
    if(checked){
        var el = $('#answer_'+nothingKey)[0];
        if (el) {
            $(el).removeAttr("checked");
            handleDisableCheckboxSubQuestions(el);
        }
    } else {
        var el = $('#answer_'+allKey)[0];
        if (el) {
            $(el).removeAttr("checked");
            handleDisableCheckboxSubQuestions(el);
        }
    }
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function radioCheckboxEvents(event){
    var element = $(event.target || event);
    if(element.is("[type=radio]")){
        handleDisableRadioSubQuestions(element);
    } else {
        handleDisableCheckboxSubQuestions(element);
    }
}

function enableAllSubquestionsOfCheckedRadiosCheckboxes() {
    $('input[type="radio"]:checked, input[type="checkbox"]:checked').each(function(i, el) {
        handleDisableCheckboxSubQuestions(el)
    })
}

function handleDisableRadioSubQuestions(element){
    element.closest('.item').find('.item:not(.specifier)').find('.subinput').attr("disabled", "disabled");
    if(element.attr('checked')){
        element.closest('.option').find('.item:not(.specifier)').find('.subinput').removeAttr("disabled");
    }
}

function handleDisableCheckboxSubQuestions(element){
    element = $(element);
    if(element.attr('checked')){
        $(element).closest('.option').find('.item:not(.specifier)').find('.subinput').removeAttr("disabled");
    } else {
        $(element).closest('.option').find('.item:not(.specifier)').find('.subinput').attr("disabled", "disabled");
    }
}

function selectInput(value){
    var lastFocus = $('.focus');
    var values = lastFocus.find(".value");
    var selectedInput = $([]);
    values.each(function(index, element){
       if(parseInt(element.textContent || element.innerHTML) == value){
           selectedInput = $(element).closest(".option").find("input[type='radio'][name='"+lastInput[0].name+"']:not(.subinput, :hidden, :disabled)");
       }
    });

    if(selectedInput.length == 0){
        selectedInput = lastFocus.find("input[type='radio'][name='"+lastInput[0].name+"']:not(.subinput, :hidden, :disabled)").eq(value-1);
    }
    if(selectedInput.length > 0) {
        selectedInput.attr('checked', 'checked');
        radioCheckboxEvents(selectedInput[0]);
        focusNextInput();
    }
}

function selectFocusedInput(){
    var el = $(document.activeElement);
    el.attr('checked', 'checked');
    radioCheckboxEvents(el);
    focusNextInput();
}

function preventDefault(event){
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.stop();
    }
    event.returnValue = false;
    event.stopPropagation();
}

function handleDownHotKeys(event){
    event.which = event.charCode || event.which || event.keyCode;
    if ($(lastInput).is("textarea") || $(lastInput).is("input[type=submit]") && (event.which == 32 || event.which == 13)) {
        return;
    }

    switch (event.which) {
        //enter
        case 13:

            if (!(nextButtonFocussed || saveButtonFocussed)) {
                preventDefault(event);
                focusNextInput();
            }
            break;
        //pg up, up arrow
        case 33:
        case 38:
            if (!$(lastInput).is("select")) {
                preventDefault(event);
                focusPrevInput();
            }
            break;
        case 37: // left arrow
            if (!$(lastInput).is("input[type=text]") && !$(lastInput).is("input[type=range]")) {
                preventDefault(event);
                focusPrevInput();
            }
            break;
        //pg dwn, down arrow
        case 34:
        case 40:
            if (!$(lastInput).is("select")) {
                preventDefault(event);
                focusNextInput();
            }
            break;
        case 39: //right arrow
            if (!$(lastInput).is("input[type=text]") && !$(lastInput).is("input[type=range]")) {
                preventDefault(event);
                focusNextInput();
            }
            break;
        //space
        case 32:
            if(!$(lastInput).is("input[type=text], select")){
                preventDefault(event);
            }
            break;
    }
}
function handleUpHotKeys(event){
    event.which = event.which || event.keyCode;
    if ($(lastInput).is("input[type=submit]") && (event.which == 32 || event.which == 13)){
        event.target.click();
        return;
    } else if($(lastInput).is("textarea, input[type=text]")){
        return;
    }

    if ($(lastInput).is("[type='radio']")) {
        switch (event.which) {
            //0
            case 48:
            case 96:
                selectInput(0);
                break;
            //1
            case 49:
            case 97:
                selectInput(1);
                break;
            //2
            case 50:
            case 98:
                selectInput(2);
                break;
            //3
            case 51:
            case 99:
                selectInput(3);
                break;
            //4
            case 52:
            case 100:
                selectInput(4);
                break;
            //5
            case 53:
            case 101:
                selectInput(5);
                break;
            //6
            case 54:
            case 102:
                selectInput(6);
                break;
            //7
            case 55:
            case 103:
                selectInput(7);
                break;
            //8
            case 56:
            case 104:
                selectInput(8);
                break;
            //9
            case 57:
            case 105:
                selectInput(9);
                break;
        }
    }
    //space
    if(event.which == 32){
            preventDefault(event);
            selectFocusedInput();
    }
}

function focusInput(input){
    $('.focus').removeClass('focus');
    focusI = panelInputs.index(input);
    if(focusI == -1 && $(input).is("[type=radio]")){
        input = $(input).closest('.fields').find('[type=radio]:first');
        focusI = panelInputs.index(input);
    }
    if($(input).is("[type='submit']")){
        $('.buttons').addClass('focus');
    } else if ($(input).is("[type='checkbox']")) {
        $(input).closest('.option').addClass('focus');
    } else {
        var focus = $(input).closest('.item:not(.table)');
        if (focus.length == 0) {
            var qname = $(input).closest('td.option').data('for');
            curPanel.find('td.option[data-for="' + qname + '"]').addClass('focus');
        } else {
            focus.addClass('focus');
        }
    }
    lastInput = $(input);
}

function focusInputIndex(index, forward){
    if (forward) {
        lastInput = panelInputs.filter(':eq('+index+'), :gt(' + index + ')').not(':hidden, :disabled').first();
    } else {
        lastInput = panelInputs.filter(':eq('+index+'), :lt(' + index + ')').not(':hidden, :disabled').last();
    }

    if (index < 0 || index > panelInputs.length || lastInput.length == 0) {
        if(forward){
            index = 0
            lastInput = panelInputs.filter(':eq('+index+'), :gt(' + index + ')').not(':hidden, :disabled').first();
        } else {
            index = panelInputs.length -1;
            lastInput = panelInputs.filter(':eq('+index+'), :lt(' + index + ')').not(':hidden, :disabled').last();
        }
    }
    if (lastInput.length > 0) {
        //IE7 disabled element focus hack
        $(lastInput[0]).show();
        lastInput[0].focus();

        saveButtonFocussed = lastInput.is('#done-button');
        nextButtonFocussed = lastInput.is('.next');
        focusI = panelInputs.index(lastInput);
    }
}

function getValidInputs(){
    var inputs = curPanel.find('input:not([id^="abortButton"]), textarea, select');
    var hadRadioQ = [];
    inputs = inputs.filter(function (index){
        if (this.type == "radio") {
            var valid = $.inArray(this.name, hadRadioQ) == -1;
            hadRadioQ.push(this.name);
            return valid;
        }
        return true;
    });

    var backI = inputs.index(inputs.filter('#back, [id^="prevButton"]').not(':hidden'));
    if(backI != -1){
        inputs = inputs.toArray();
        inputs.unshift(inputs.splice(backI, 1)[0]);
        inputs = $(inputs);
    }

    return inputs;
}

function focusNextInput(){
    lastInput.blur();
    setTimeout(function() { focusInputIndex(focusI+1, true);}, 50);
}
function focusPrevInput(){
    lastInput.blur();
    setTimeout(function() { focusInputIndex(focusI-1, false);}, 50);
}

function hotkeyDialog(){;
    $(".hotkeyDialog").last().dialog({ draggable : false, resizable : false, modal : true, width : 550,
    buttons: {
        "Sluiten": function(){
            $(this).dialog("close");
        }
    }
    });
}

//TODO: make this work for:
//* enabling/disabling subquestions,
//* hiding other questions,
//* dates,
//* all/nothing checkboxes
function assignValue(qkey, val){
    var inputs;
    if(val instanceof Object){//checkbox vals are passed as an object hash
        inputs = $("[name^='answer["+qkey+"_'][type!='hidden']");
    } else {
        inputs = $("[name='answer["+qkey+"]'][type!='hidden']");
    }
    if(inputs.length > 0){
        var type = inputs[inputs.length-1].type;
        if (type == "radio" || type == "scale") {
            var input = inputs.filter("[value='" + val + "']");
            if (input && input.length > 0) {
                input.first().attr("checked", "checked");
            }
        } else if (type == "text") {
            var input = inputs.get(0);
            input.value = val;
        } else if( inputs.get(0).tagName == "TEXTAREA"){
            var input = inputs.get(0);
            input.textContent = val;
        } else if (type == "checkbox") {
            $.each(val, function(ckey, cvalue){
                var input = inputs.filter("input[name='answer["+ckey+"]']");
                if (cvalue == 1) {
                    input.attr("checked", "checked");
                } else {
                    input.removeAttr("checked");
                }
            });
        } else if (type == 'select-one'){
            var input = inputs.find("[value="+val+"]")[0]
            if(input){
                input.selected = "selected";
            }
        }
    }
}


function processExtraData(){

    if (typeof(extra_question_values) != "undefined") {
        $.each(extra_question_values, function(question, value){
            if (value != null) {
                assignValue(question, value);
            }
        });
    }
    if (typeof(extra_failed_validations) != "undefined") {
        $.each(extra_failed_validations, function(question, hash){
            var item = $('#answer_' + question + "_input").closest('.item');
            item.addClass('errors');

            if (hash instanceof Array) {
                $.each(hash, function(){
                    item.find("." + this['valtype']).first().show();
                });
            }
            else {
                item.find("." + hash['valtype']).first().show();
            }
        });
    }
}

function doDivPrint(url){
    var result = $(document.createElement("div"));
    result.load(url, $('form').serializeArray(), function(){
        if(result.find(".notice").length == 0){
          $('.x_container').html(result.find("#content").html());
          if(document.recalc){
            document.recalc();
          }
          $('.x_container').print_area({ afterFilter : function(){
              $('.x_container *').remove();
          }});
        } else {
          $("body > #content").replaceWith(result.find("#content"));
          if (isBulk){
            prepareBulk();
          } else {
            preparePaged();
          }
        }
    });
}


function modalFrame(url){
    $("#modalFrame").attr('src', url);
    //window.scrollTo(0,0);
    $("#modalFrameDialog").dialog({ draggable : false, resizable : false, modal : true, width : 700, height : 600,
    buttons: {
        "Terug": function(){
            $(this).dialog("close");
            $("#modalFrame").attr('src', "about:blank");
        }
    }
    });
}

function prepareBulk(){
    if(hotkeysEnabled) {
      curPanel = $('form');
      panelInputs = getValidInputs();
      focusI = 0;
      focusInputIndex(focusI, true);
    }
}

function preparePaged(){
    // enable javascript-based previous/next links
    $(".panel .buttons").show();

    // hide first previous button, and last next button
    $(".panel:first .buttons .prev").css('visibility', 'hidden');
    $(".panel:last  .buttons .next").css('visibility', 'hidden');

    //Go to first panel with errors
    var errors = $('.errors');
    if (errors.length > 0){
        shownFlash = false;
        activatePanel(errors.closest('.panel').eq(0), true, true);
    }
}

//ONLY USE FOR KEYUP AND KEYDOWN
function handlePreventDefault(event){

    event.which = event.which || event.keyCode;

    if($(event.target).is('textarea')){
        return;
    }
    switch (event.which) {
        //enter
        case 13:
            preventDefault(event);
            break;
        //pg up, up arrow
        case 33:
        case 38:
        //pg dwn, down arrow
        case 34:
        case 40:
        //space
        case 32:
            break;
    }
}

function showPrint(url){
  var result = $(document.createElement("div"));
    result.load(url, $('form').serializeArray(), function(){
        if(result.find(".errors").length == 0){
          $('.x_container').html(result.find("#content").html());
          if(document.recalc){
            document.recalc();
          }
          $('.x_container').show();
        }
    });
}

function setupLeavePageNag() {
  leave_page_text = $("#leave_page_alert").html();

  function leave_page_nag(e){
    var e = e || window.event;

    e.cancelBubble = true;

    //Firefox 4+ does not use this text
    e.returnValue = leave_page_text;

    if (e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }

    return leave_page_text;
  }
  if(leave_page_text && leave_page_text.length > 0){
    window.onbeforeunload = leave_page_nag;
  }
}

function handleAjaxFormRequests() {
  $(document).on('ajax:success', "form", function(event, data, status, xhr) {
    content_type = (xhr.getResponseHeader("content-type")||"").split(';')[0]
    if (content_type == 'text/html') { // not json response
      $('#content').replaceWith(data);
      preparePaged();
    }
  });
  $(document).on('ajax:error', "form", function(event, data, status, xhr) {
    var errorMessage = 'Er ging iets fout bij het opslaan van de antwoorden. ' +
                      'Controleer je internetverbinding en probeer het nogmaals.';
    $('.flash').append('<div class="error">' + errorMessage +'</div>').show()
  });
  $(document).on('ajax:beforeSend', "form", function() {
    $('html').addClass('busy')
  })
  $(document).on('ajax:success ajax:error', "form", function() {
    $('html').removeClass('busy')
  })
}

var leave_page_text;
$(document).ready(
    function() {

        $('input').placeholder();

        setupLeavePageNag();

        hotkeysEnabled = $(".hotkeyDialog").length > 0;

        $(".deselectable").deselectable();

        $('input[type="radio"]:not(.subinput), input[type="checkbox"]:not(.subinput)').live("click", radioCheckboxEvents );

        processExtraData();

        scrollToNextQuestion = $("form").hasClass("scroll_to_next_question");
        if(scrollToNextQuestion){
          questionInputs = $("input[name][type!='hidden'], select").filter(function(index){
            var element = $(this);
            return element.is($("[name='"+ element.attr('name') +"'][type!='hidden']:first")) || element.is('[name="commit"]');
          });
          curQuestionInputIndex = 0;
          var scrollToHandler = function(event){
              var iname = $(event.target).attr('name');
              curQuestionInputIndex = questionInputs.index($("[name='"+ iname + "'][type!='hidden']"));
              curQuestionInputIndex += 1;
              nextQuestionInput = questionInputs[curQuestionInputIndex];
              $.scrollTo(nextQuestionInput, 200, {offset: -50});
          };
          $(".item input[type=radio]").on("click", scrollToHandler);
          $(".item select").on("change", scrollToHandler);
        }

        isBulk = $('form.bulk, form.print').size() > 0;
        if (hotkeysEnabled) {
            $("body").live("keydown", handleDownHotKeys);
            $("body").live("keyup", handleUpHotKeys);
            $("body").live("click", function (){
                nextButtonFocussed = false;
                saveButtonFocussed = false;
            })
            $(".item input, .item textarea, .buttons input, select").live("click", function(event){
                focusInput(event.target);
            })
            $(".item input, .item textarea, .buttons input, select").live("focus", function(event){
                focusInput(event.target);
            });
        }

        if (isBulk) {
            prepareBulk();
        } else{
            // show previous panel
            $(".panel .prev input").live("click",
                function(event) {
                    event.preventDefault();
                    var prevPanel = $(this).parents('.panel').prev()
                    activatePanel(prevPanel, true, false);
                }
            );

            // show next panel
            $(".panel .next input").live("click",
                function(event) {
                    event.preventDefault();
                    var nextPanel = $(this).parents('.panel').next();
                    if (validatePanel($(this).parents('.panel').first())) {
                        activatePanel(nextPanel, true, true);
                    }
                }
            );

            $(document).on("click", "#done-button", function(event) {
                if (!validatePanel($('.current.panel').first())) {
                    done_button_semaphore = true;
                    event.preventDefault(); return false;
                }
            });

            handleAjaxFormRequests();

            preparePaged();
        }

        $('input[type="checkbox"]:not(.subinput), input[type="radio"]:not(.subinput)').each( function(index, element){
           radioCheckboxEvents(element);
        });

        $(document).keydown(handlePreventDefault);
        $("input[text_var]").each(function(i, ele){
            ele = $(ele);
            var tvar = ele.attr('text_var');

            ele.change(function (){
                $("span[text_var='"+tvar+"']").html(ele.attr('value'));
            });
            if(ele.attr('value')) {
              ele.change();
            }
        });

        enableAllSubquestionsOfCheckedRadiosCheckboxes();

        // Don't submit if we've just submitted already
        var done_button_semaphore = true;
        $(".save input#done-button, .back input, .abort input").click(function(event){
            window.onbeforeunload = null;
            if (done_button_semaphore){
                done_button_semaphore = false
                setTimeout(function(){ done_button_semaphore = true }, 3000)
                return true;
            } else {
                return false;
            }
        });
    }
);
