app.controller('chartCtrl', function($scope,$rootScope) {
    var chart = JSON.parse(localStorage["chartData"]);
    $rootScope.isUploaded = true;
    var xAxis = chart.map(function(a) {return a.date;});
    var yAxis = chart.map(function(a) {return a.rate;});
    Highcharts.chart('container', {
        title: {
            text: 'Prepared speech rate'
        },
        xAxis: {
				    categories: xAxis,
				},
        series: [{
				    data: yAxis,
            name: 'Month'
				}],
        tooltip: {
            formatter: function() {
                            return this.x + ' -> ' + this.y 
                       }
        }
    });
 });
