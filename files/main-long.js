$(document).ready(function () {

    var validator = $("#appForm").validate({
        debug: true,
        errorPlacement: function (error, element) {
            if (element.attr("type") == "radio") {
                return false;
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            if (element.type === "radio") {
                $(element).closest('.quiz-box').addClass(errorClass).removeClass(validClass);
            } else {
                $(element).parent().addClass(errorClass).removeClass(validClass);
            }
        },
        unhighlight: function (element, errorClass, validClass) {
            if (element.type === "radio") {
                $(element).closest('.quiz-box').removeClass(errorClass).addClass(validClass);
            } else {
                $(element).parent().removeClass(errorClass).addClass(validClass);
            }
        },
        rules: {
            postal_code: {
                required: true,
                cdnPostal: true
            },
            phone_home: {
                required: true,
                phoneUS: true
            },
            phone_cell: {
                phoneUS: true
            }
        },
        onsubmit: false,
        submitHandler: function (form) {
            if ($(form).valid()) {
                form.submit();
            }
            return false; // prevent normal form posting
        }
    });

    $.validator.addClassRules("text-field", {
        required: true,
        minlength: 2
    });

    $.validator.addMethod("cdnPostal", function (postal, element) {
        return this.optional(element) ||
            postal.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/);
    }, "Please specify a valid postal code.");

    $('#appForm').on('keyup keypress', function(e) {
      var keyCode = e.keyCode || e.which;
      if (keyCode === 13) { 
        e.preventDefault();
        return false;
      }
    });

    $('input:not([name="monthly_residence_cost"]), select').on('change', function () {
        
        if ($(this).attr('type') == 'radio') {
            fbpStep($(this).prop("checked", true));
            bookmarkscroll.scrollTo($(this).closest('.quiz-box').next());
        } else {
            fbpStep($(this));
        }
    });

    $('.btn1').click(function () {
        var $parent = $(this).closest('.quiz-optnBx'),
            $inputs = $parent.find('input[type="text"],input[type="tel"],input[type="email"],select'),
            validationCount = 0;

        if ($inputs.length) {
            $inputs.each(function () {
                if (validator.element($(this))) {
                    ++validationCount
                }
            });
        }

        if ($(this).attr('name') == 'monthly_residence_cost') {
            fbpStep($(this));
        }

        if (validationCount == $inputs.length) {
            bookmarkscroll.scrollTo($(this).closest('.quiz-box').next());
        }
    });


    $('.complete-btn').click(function () {
        if ($('#appForm').valid()) {
            $(this).prop('disabled', true);
            if ($('.error-msg').length)
                $('.error-msg').remove();
            $('#appForm').submit();
        } else {
            if (!$('.error-msg').length)
                $('<span class="error-msg">Please fix errors before you can submit the application</span>').insertAfter($(this));
        }
        return false;
    });

    function fbpStep($el) {
        var key = $el.attr('name'),
            value = $el.val();
        fbq('trackCustom', 'appStep-' + key, {
            'input': value
        });
    }

    $(".loan-amount-slider").ionRangeSlider({
        min: 0,
        max: 5000,
        from: 2500,
        step: 100,
        prettify_enabled: true,
        prettify_separator: ",",
        prefix: "$",
    });
});