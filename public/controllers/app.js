app.controller('MainCtrl', function($scope, XLSXReaderService, $rootScope) {
    $scope.gridOptions = {};
    if(!$rootScope.isUploaded)
        $scope.showJSONPreview = false;
    else
        $scope.showJSONPreview = true;
        $scope.class = "link-hide";
    $scope.fileChanged = function(files) {
        $scope.showJSONPreview = true;
        localStorage["chartData"] =
        $scope.isProcessing = true;
        $scope.sheets = [];
        $scope.class = "btn btn-pink";
        $rootScope.isUploaded = false;
        $scope.excelFile = files[0];
        XLSXReaderService.readFile($scope.excelFile, $scope.showPreview, $scope.showJSONPreview).then(function(xlsxData) {
            $scope.sheets = xlsxData.sheets;
            $scope.isProcessing = false;
        }).then(function(){
            var Role = {};
            for( key in $scope.sheets){
                for( var i=0;i<$scope.sheets[key].length;i++){
                    if($scope.sheets[key][i].hasOwnProperty("Roles")){
                        if($scope.sheets[key][i].Roles == "Joke of the day (3 min)" && !Role.hasOwnProperty('Joke of the day'))
                            Role['Joke of the day'] = new Array();
                        else if($scope.sheets[key][i].Roles.startsWith("Prepared Speech") && !Role.hasOwnProperty('Prepared Speech'))
                            Role['Prepared Speech'] = new Array();
                        else if($scope.sheets[key][i].Roles.startsWith("Evaluators") && !Role.hasOwnProperty('Evaluators'))
                            Role['Evaluators'] = new Array();
                        else{
                            if(!Role.hasOwnProperty($scope.sheets[key][i].Roles))
                                Role[$scope.sheets[key][i].Roles] = new Array();
                        }

                        for(property in $scope.sheets[key][i]){
                        var date  = Date.parse(property.split(',')[1]+', '+'20'+key.split(' ')[1]);
                        var now = new Date();
                        if(property != "Roles" && now>=date){
                            var data = {};
                            var a = 0;
                            data.name = $scope.sheets[key][i][property];
                            if($scope.sheets[key][i].Roles.startsWith("Joke of the day"))
                                Role['Joke of the day'].push(data);
                            else if($scope.sheets[key][i].Roles.startsWith("Prepared Speech")){
                                Role['Prepared Speech'].push(data);
                            }
                            else if($scope.sheets[key][i].Roles.startsWith("Evaluators"))
                                Role['Evaluators'].push(data);
                            else
                                Role[$scope.sheets[key][i].Roles].push(data);
                        }
                    }
                }
            }
        }
            var chartData = [];
            for( key in $scope.sheets){
                for( var i=0;i<$scope.sheets[key].length;i++){
                    var obj = {};
                    if($scope.sheets[key][i].hasOwnProperty("Roles")){
                        var sInd = -1;
                        for(var j = 0; j<chartData.length;j++){
                            if(chartData[j].date == key)
                                sInd = j;
                        }

                        if($scope.sheets[key][i].Roles.startsWith("Prepared Speech") && sInd == -1){
                            obj.date = key;
                            var s = 0;
                            for(property in $scope.sheets[key][i]){
                                var date  = Date.parse(property.split(',')[1]+', '+'20'+key.split(' ')[1]);
                                var now = new Date();
                                if(property != "Roles" && now>=date && $scope.sheets[key][i][property].startsWith("TM"))
                                    s+=1;
                            }
                            obj.rate = s;
                            chartData.push(obj)
                        }
                        else if($scope.sheets[key][i].Roles.startsWith("Prepared Speech")) {
                            for(property in $scope.sheets[key][i]){
                                var date  = Date.parse(property.split(',')[1]+', '+'20'+key.split(' ')[1]);
                                var now = new Date();
                                if(property != "Roles" && now>=date && $scope.sheets[key][i][property].startsWith("TM"))
                                    chartData[sInd].rate = chartData[sInd].rate + 1;
                            }
                        }
                    }
                }
            }

            localStorage["chartData"] = JSON.stringify(chartData);
            var names = ["TM Ashwin","TM Sunil","TM Meharoof","TM Vijo","TM Hari","TM John",
  "TM Sanandanan","TM Amit","TM Deepak","TM Deljo","TM Vishnu","TM Gilsha","TM Priya","TM Anisha","TM Niji","TM Suraj","TM Prasad",
  "TM Dhaneesh","TM Sajeesh","TM Jagadeesh","TM Anil","TM Vysakh","TM Sam"];
           var Result = [];
           for(var i=0; i<names.length;i++){
              var ResultObj = {};
              ResultObj.name = names[i];
              for(element in Role){
                  var s = 0;
                  for( var j=0;j<Role[element].length;j++){
                      if(Role[element][j].name.indexOf(names[i]) != -1)
                          s+=1;
                  }
                  ResultObj[element] = s;
                }
                Result.push(ResultObj);
            }
            $scope.showJSONPreview = true;
            setColumns();
            $scope.gridOptions.data = Result;
            localStorage["Result"] = JSON.stringify(Result);
         });
      }
function setColumns(){

  $scope.gridOptions.columnDefs = [{
    name: 'name',
    width: 150,
    pinnedLeft: true
  },
  {
   name: 'Seargent at Arms',
   width:100
  },
  {
   name: 'President',
   width:105
  },
  {
   name: 'Club Secretary',
   width:100
  },
  {
   name: 'Toastmaster of the Day',
   width:125
  },
  {
   name: 'Table Topic Master',
   width:125
  },
  {
   name: 'General Evaluator',
   width:100
  },
  {
   name: 'Gramarian',
   width:110
  },
  {
   name: 'Ah Counter',
   width:120
  },
  {
   name: 'Timekeeper',
   width:120
  },
  {
   name: 'Vote Counter',
   width:100
  },
  {
   name: 'Joke of the day',
   width:100
  },
  {
   name: 'Prepared Speech',
   width:100
  },
  {
   name: 'Evaluators',
   width:135
  }];
}
$scope.gridOptions.onRegisterApi= function(gridApi) {
  if($rootScope.isUploaded){
      $scope.class = "btn btn-pink";
      setColumns();
      $scope.showJSONPreview = true;
      var Result = JSON.parse(localStorage["Result"]);
      $scope.gridOptions.data = Result;
    }
  };
});
