$(document).ready(function() {
	/*REMOVE DAFAULTS AND NUMBER_FORMAT*/
	(function(A){A.fn.extend({defaultValue:function(B){return this.each(function(){var D=B||A(this).attr("rel");var I=A(this).attr("type")||null;var G=null;var E=A(this);if(I=="password"){C(this);A(this).blur(function(){if(A(E).val().length<=0){A("#"+G).show();A(E).hide();}});}else{A(this).click(function(){F(this);}).keypress(function(){if(A(this).val().length>0){H(this);}}).blur(function(){H(this);}).focus(function(){F(this);});A.trim(A(this).val());H(this);}function F(J){if(A(J).val()==D){A(J).val("");}}function H(J){val=A.trim(A(J).val());if(val.length<=0||val==D){A(J).val(D).addClass("empty");}else{A(J).removeClass("empty");}}function C(J){G=A(J).attr("id")+"Clone";A("<input id='"+G+"' type='text' />").attr("value",D).insertAfter(J).show().focus(function(){A(this).hide();A(E).show();setTimeout(function(){A(E).focus();},10);}).attr("tabIndex",A(J).attr("tabIndex")).addClass(A(J).attr("class")+" empty").attr("style",A(J).attr("style"));A(E).hide();}});}});})(jQuery);
	function number_format( number, decimals, dec_point, thousands_sep ) {
	    var n = number, prec = decimals;
	    var toFixedFix = function (n,prec) {
	        var k = Math.pow(10,prec);
	        return (Math.round(n*k)/k).toString();
	    };
	    n = !isFinite(+n) ? 0 : +n;
	    prec = !isFinite(+prec) ? 0 : Math.abs(prec);
	    var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
	    var dec = (typeof dec_point === 'undefined') ? '.' : dec_point;
	    var s = (prec > 0) ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;
	    var abs = toFixedFix(Math.abs(n), prec);
	    var _, i;
	    if (abs >= 1000) {
	        _ = abs.split(/\D/);
	        i = _[0].length % 3 || 3;

	        _[0] = s.slice(0,i + (n < 0)) +
	              _[0].slice(i).replace(/(\d{3})/g, sep+'$1');
	        s = _.join(dec);
	    } else {
	        s = s.replace('.', dec);
	    }
	    var decPos = s.indexOf(dec);
	    if (prec >= 1 && decPos !== -1 && (s.length-decPos-1) < prec) {
	        s += new Array(prec-(s.length-decPos-1)).join(0)+'0';
	    }
	    else if (prec >= 1 && decPos === -1) {
	        s += dec+new Array(prec).join(0)+'0';
	    }
	    return s;
	}



	/*THEMEN*/
	$("#archive_search input[type=submit]").hide();
    var search = "In Themen suchen";
	if ($.browser.safari) {
		$("#archive_search #suchbox").after("<input type='search' name='q' value='"+ search + "' id='search_field' class='safari' autosave='at.immobilienundconsulting.suche' results='5'/> ");
		$("#archive_search #suchbox").remove();
	} else {
	    $("#archive_search #suchbox").attr('value',search);
	};
	$("#archive_search form").css({"padding-bottom":"0.5em"});
	$("#archive_search p").css({"padding-top":"0.7em"});
	$("#archive_search select").change(function() {
		$("#themen").submit();
	});
	function remove_defaults(){
	  $("#archive_search input[type=text], #archive_search input[type=search]")
	    .each(function(){
	      this.default_value = this.value;
	    });            
	  $("#archive_search input[type=text], #archive_search input[type=search]")
	    .focus(function(){
	      if(this.value == this.default_value) {
	        this.value = "";
	      };
	    }).end();
	}
	$(remove_defaults);
	
	
	/*EMPFEHLUNGSRECHNER*/
	$('#hauspreis').defaultValue('0');
    $("#empfehlungsrechner").bind("keypress", function(e) {
    	if (e.keyCode == 13) {
        	search($("#searchTerm").attr('value'));
            return false;
        }
    });
	function calc_empfehlungsrechner() {
		var hauspreis = parseFloat($('#hauspreis').val());
		var anteil = hauspreis * 0.05 * 0.1;
		var anteil = number_format(anteil, 2, ',', '.');
		$('#anteil').text(anteil + ' €');
	}
	calc_empfehlungsrechner();
	
	
	/*ZINSRECHNER*/
	$('input').keyup(calc_empfehlungsrechner);
	$('#darlehenssumme').defaultValue('0');
	$('#eigenkapital').defaultValue('0');
	$('#zinssatz').defaultValue('4.3')
	$('#tilgung').defaultValue('1');
    $("#zinsrechner").bind("keypress", function(e) {
    	if (e.keyCode == 13) {
        	search($("#searchTerm").attr('value'));
            return false;
        }
    });
	function calc_monatsbelastung(kreditsumme, zinssatz, tilgung) {
		var wertzinsen = kreditsumme * (zinssatz / 100) / 12;
		var werttilgung = kreditsumme * (tilgung / 100) / 12;
		var monatsbelastung = wertzinsen + werttilgung;
		return monatsbelastung;
	}
	function calc_restschuld(kreditsumme, zinssatz, zinsbindung, tilgung) {
		var restschuld = kreditsumme-((kreditsumme*(tilgung+zinssatz)/100/12)-kreditsumme*zinssatz/100/12)*(Math.pow((1+zinssatz/12/100),(zinsbindung*12))-1)/(zinssatz/12/100)
		return restschuld;
	}
	function calc_bezahltezinsen(kreditsumme,tilgung,zinssatz,zinsbindung,restschuld) {
		var restschuldFloat = parseFloat(restschuld);
		var bezahltezinsen = kreditsumme*(tilgung+zinssatz)/100/12*zinsbindung*12-(kreditsumme-restschuldFloat);
		return bezahltezinsen;
	}
	function calc_laufzeit(zinssatz, tilgung) {
		var laufzeit = eval((Math.log(((zinssatz/100)+(tilgung/100))/(tilgung/100))/Math.log(1+((zinssatz/100)/12)))/12);
		return laufzeit;
	}
	function calc_zinsrechner() {
		var darlehenssumme = parseFloat($('#darlehenssumme').val());
		var eigenkapital = parseFloat($('#eigenkapital').val());
		var kreditsumme = darlehenssumme - eigenkapital;
		var zinsbindung = $('#zinsbindung').val();
		var zinssatz = parseFloat($('#zinssatz').val());
		var tilgung = parseFloat($('#tilgung').val());
		var monatsbelastung = calc_monatsbelastung(kreditsumme, zinssatz, tilgung);
	    var restschuld = calc_restschuld(kreditsumme, zinssatz, zinsbindung, tilgung);
	    var getilgterbetrag = kreditsumme - restschuld;
		var bezahltezinsen = calc_bezahltezinsen(kreditsumme,tilgung,zinssatz,zinsbindung,restschuld);
		var laufzeit = calc_laufzeit(zinssatz, tilgung);
		$('#monatsbelastung_druck').text(number_format(monatsbelastung, 2, ',', '.') + ' €');
		$('#getilgterbetrag_druck').text(number_format(getilgterbetrag, 2, ',', '.') + ' €');
		$('#restschuld_druck').text(number_format(restschuld, 2, ',', '.') + ' €');
		$('#bezahltezinsen_druck').text(number_format(bezahltezinsen, 2, ',', '.') + ' €');
		$('#laufzeit_druck').text(number_format(laufzeit, 1, ',', '') + ' Jahre');
	}
	calc_zinsrechner();
	$('input').keyup(calc_zinsrechner);
	$('select').change(calc_zinsrechner);


   /*IMMOBILIEN*/ 
	$(".immobilien .photobox div").easySlider();

   /*KAEUFER SUCHT VERKAEUFER*/ 
	$('#suchen #kaufpreis').parent().hide();
	$('#suchen #mietpreis').parent().hide();
	if ($("#kauf:checked", "#suchen").length) { 
		$('#suchen #kaufpreis').parent().show();
	}
	if ($("#miete:checked", "#suchen").length) { 
		$('#suchen #mietpreis').parent().show();
	}
	$('input:radio[name=kaufmiete]').click(function() {
	    if ($(this).attr("id")==='kauf') {
			$('#suchen #kaufpreis').parent().show();
			$('#suchen #mietpreis').parent().hide();
	    } else {
			$('#suchen #kaufpreis').parent().hide();
			$('#suchen #mietpreis').parent().show();
	    }
  	});
});