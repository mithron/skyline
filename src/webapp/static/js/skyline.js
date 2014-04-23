var GRAPHITE_HOST,
    OCULUS_HOST,
    FULL_NAMESPACE,
    mini_graph,
    big_graph,
    selected,
    anomalous_datapoint;

var mini_data = [];
var big_data = [];
var initial = true;
var FULL_NAMESPACE= "metrics.";
// This function call is hardcoded as JSONP in the anomalies.json file
var handle_data = function(data) {
    $('#metrics_listings').empty();
    for (i in data) {
        metric = data[i];
        name = metric[1]
        var src = GRAPHITE_HOST + '/render/?width=1400&from=-1hour&target=' + name;
        // Add a space after the metric name to make each unique
        //to_append = "<div class='sub'><a target='_blank' href='" + src + "'><div class='name'>" + name + " </div></a>&nbsp;&nbsp;"
        to_append = "<div class='sub'><div class='name'>" + name + " </div>&nbsp;&nbsp;"
        if (OCULUS_HOST != ''){
          //to_append += "<a class='oculus' target='_blank' href=" + OCULUS_HOST + "/search?p_slop=20&dtw_radius=5&search_type=FastDTW&query=" + name + "&page=&filters=><i class='icon-share-alt'></i></a>";
          to_append += "<i class='icon-del' data-point='"+ parseInt(metric[0]) +"' data-name='"+ name +"'>&times;</i>";
        }
        to_append += "<div class='count'>" + parseInt(metric[0]) + "</div>";
        $('#metrics_listings').append(to_append);
    }

    if (initial) {
        selected = data[0][1];
        initial = false;
    }

    handle_interaction();
}

// The callback to this function is handle_data()
var pull_data = function() {

 $.ajax({
            url: "/static/dump/anomalies.json",
            async: false,
			cache:false,
            success: function (data){
              
			   if(data!=null && data[0]!=null)	
					handle_data(data);
            }
        });

}

var handle_interaction = function() {
    $('.sub').removeClass('selected');
    $('.sub:contains(' + selected + ')').addClass('selected');

    anomalous_datapoint = parseInt($($('.selected').children('.count')).text())
 
    $.get("/api?metric=" + FULL_NAMESPACE + "" + selected, function(d){
		
        big_data = JSON.parse(d)['results'];
	
        offset = (new Date().getTime() / 1000) - 3600;
        mini_data = big_data.filter(function (value) {
          return value[0] > offset;
        });
	
console.log(mini_data.length);	
for(var i in mini_data){
	if(i%1000!=0){
		mini_data.splice(i,1);	
	}
}
console.log(mini_data.length);
for(var i in big_data){
	if(i%1000!=0){
		big_data.splice(i,1);
	}
}


		$.plot("#mini_label .graph", [mini_data],{grid:{hoverable:true},xaxis: {mode: "time"}});
		
		$.plot("#big_label .graph", [big_data],{grid:{hoverable:true},xaxis: {mode: "time"}});
		
		var previousPoint = null;
$("#mini_label .graph").bind("plothover", function (event, pos, item) {
if (item) {
	if (previousPoint != item.datapoint) {
		previousPoint = item.datapoint;
		$("#tooltip").remove();
		var date = new Date(item.datapoint[0]*1000);
// hours part from the timestamp
var hours = date.getHours();
// minutes part from the timestamp
var minutes = date.getMinutes();
if(minutes<10) minutes = "0"+minutes;
// seconds part from the timestamp
var seconds = date.getSeconds();
if(seconds<10) seconds = "0"+seconds;

// will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes + ':' + seconds;

		showTooltip(item.pageX, item.pageY, '(' + formattedTime + ', ' + item.datapoint[1]+')');
	}
} else {
	$("#tooltip").remove();
	previousPoint = null;
}
});

	var previousPoint = null;
$("#big_label .graph").bind("plothover", function (event, pos, item) {
if (item) {
	if (previousPoint != item.datapoint) {
		previousPoint = item.datapoint;
		$("#tooltip").remove();
		var date = new Date(item.datapoint[0]*1000);
// hours part from the timestamp
var hours = date.getHours();
// minutes part from the timestamp
var minutes = date.getMinutes();
if(minutes<10) minutes = "0"+minutes;
// seconds part from the timestamp
var seconds = date.getSeconds();
if(seconds<10) seconds = "0"+seconds;

// will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes + ':' + seconds;

		showTooltip(item.pageX, item.pageY, '(' + formattedTime + ', ' + item.datapoint[1]+')');
		
	}
} else {
	$("#tooltip").remove();
	previousPoint = null;
}
});


function showTooltip(x, y, contents) {
    $('<div id="tooltip">' + contents + '</div>').css( {
        position: 'absolute',
        display: 'none',
        top: y + 5,
        left: x + 5,
        border: '1px solid #fdd',
        padding: '2px',
        'background-color': '#fee',
        opacity: 0.80
    }).appendTo("body").fadeIn(200);
}

        /*
		*/
    }); 


    $('#graph_title').html(selected);

    // Bleh, hack to fix up the layout on load
    $(window).resize();
}

$(function(){
    $.get('/app_settings', function(data){
        // Get the variables from settings.py
        data = JSON.parse(data);
        FULL_NAMESPACE = data['FULL_NAMESPACE'];
        GRAPHITE_HOST = data['GRAPHITE_HOST'];
        OCULUS_HOST = data['OCULUS_HOST'];

        // Get initial data after getting the host variables
        pull_data();

        $(window).resize();
    })

    // Update every ten seconds
    window.setInterval(pull_data, 10000);

    // Set event listener
    $('.name').live('hover', function() {
        temp = $(this)[0].innerHTML;
        if (temp != selected) {
            selected = temp;
            handle_interaction();
        }
    })

    // Responsive graphs 
    $(window).resize(function() {
        resize_window();
    });
	
	
	$(".icon-del").live("click",function(){
		
		$.ajax({
        url: "/delete",
        data:{
		point:$(this).attr("data-point"),
		name:$(this).attr("data-name")
		},
        dataType: 'json',
        success:function(data){
			
		}
		
		});
		
		$(this).parents(".sub").fadeOut('slow');
	});
});

// I deeply apologize for this abomination
var resize_window = function() {
	
	$("#mini_label .graph").css({width:($('#graph_container').width() - 7),height:($('#graph_container').height() * 1.2)});
	$("#big_label .graph").css({width:($('#graph_container').width() - 7),height:($('#graph_container').height() * (3/5) - 5)});
	
	

}

// Handle keyboard navigation
Mousetrap.bind(['up', 'down'], function(ev) {
    switch(ev.keyIdentifier) {
        case 'Up':
            next = $('.sub:contains(' + selected + ')').prev();
        break;

        case 'Down':
            next = $('.sub:contains(' + selected + ')').next();
        break;
    }

    if ($(next).html() != undefined) {
        selected = $(next).find('.name')[0].innerHTML;
        handle_interaction();
    } 

    return false;
}, 'keydown');


