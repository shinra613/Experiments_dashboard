
let datafetcher = ZOHO.CREATOR.API;
let apiPromise = ZOHO.CREATOR.init();

          
let finalres = apiPromise.then( function (data) { 
 
  let config = {
    appName: "Sample1-new",
    reportName: "All_Experiments"

  }

   datafetcher.getAllRecords(config).then( function (response) { 
    
     bootstrap(response.data);
  });

});

let CountArr = [];
let usersArr = [];
let focusCountArr = [];

const bootstrap = (testData) => { 

  
  testData.map((i) => {
    if (i.AssignedTo != '') {
      usersArr.push(i.AssignedTo);
    } else { 
      usersArr.push("unassigned");
    }
   
  });
  
  
  let users = [...new Set(usersArr)];
  
  let focusArea = ['Upselling', 'Lead Generation', 'Customer Engagement', 'unassigned'];
  
  let userDropDown = document.getElementById('User');
  
  

  userWorkHandler(users,testData);
  StatusCountHandler("Completed", "cmp",testData);
  StatusCountHandler("In Progress", "inpgr",testData);
  StatusCountHandler("In Development", "indev",testData);
  StatusCountHandler("On Hold", "onhld",testData);
  StatusCountHandler("Not Started", "ntstrd",testData);
  pieHandler(users, CountArr);
  focusHandler(focusArea,testData);
  barHandler(focusArea, focusCountArr);
  incompHandler("All Users",testData);

  users.map((i) => {
    let option = document.createElement("option");

    
    option.text = i;
    option.value = i;
    userDropDown.add(option);
  })

  window.selectChanged = function (theSelected) {
    console.log(theSelected.value);
    incompHandler(theSelected.value,testData);
  };

 

}

$(".cmp").click(function() {
  window.location = $(this).find("a").attr("href"); 
  return false;
});
$(".inpgr").click(function() {
  window.location = $(this).find("a").attr("href"); 
  return false;
});
$(".indev").click(function() {
  window.location = $(this).find("a").attr("href"); 
  return false;
});
$(".onhld").click(function() {
  window.location = $(this).find("a").attr("href"); 
  return false;
});
$(".ntstrd").click(function() {
  window.location = $(this).find("a").attr("href"); 
  return false;
});


const StatusCountHandler = (status, statusID,testData) => {
  let counter = 0;
  testData.filter((i) => {
    if (i.Status == status) {
      counter += 1;
    }


  });

  let sclass = document.getElementById(statusID);
  let sspan = document.createElement('h1');
  sspan.innerHTML = counter;
  sclass.appendChild(sspan);


}


const pieHandler = (pieLables, pieValues) => {
  let ctx = document.getElementById('ChartTwo').getContext('2d');

  
  let colorHex = ['#180A0A', '#711A75', '#F10086', '#F582A7', '#E15FED', '#6EDCD9'];



  let myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      datasets: [{
        data: pieValues,
        backgroundColor: colorHex
      }],
      labels: pieLables
    },
    options: {
      responsive: true,
      legend: {
        position: 'bottom'
      },
      plugins: {
        datalabels: {
          color: '#fff',
          anchor: 'end',
          align: 'start',
          offset: -10,
          borderWidth: 2,
          borderColor: '#fff',
          borderRadius: 25,
          backgroundColor: (context) => {
            return context.dataset.backgroundColor;
          },
          font: {
            weight: 'bold',
            size: '10'
          },
          formatter: (value) => {
            return value + ' %';
          }
        }
      }
    }
  })

}

const barHandler = (barLables, barValues) => {
  
    let ctx = document.getElementById('ChartOne').getContext('2d');
  
    
    let colorHex = ['#180A0A', '#711A75', '#F10086', '#F582A7', '#E15FED', '#6EDCD9'];
  
  
  
    let myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label:"Focus areas",
          data: barValues,
          backgroundColor: colorHex
        }],
        labels: barLables
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom'
        },
        plugins: {
          datalabels: {
            color: '#fff',
            anchor: 'end',
            align: 'start',
            offset: -10,
            borderWidth: 2,
            borderColor: '#fff',
            borderRadius: 25,
            backgroundColor: (context) => {
              return context.dataset.backgroundColor;
            },
            font: {
              weight: 'bold',
              size: '10'
            },
            formatter: (value) => {
              return value + ' %';
            }
          }
        }
      }
    })
  
  
  
 }

const userWorkHandler = (userArr,testData) => {


  for (i = 0; i < userArr.length; i++) {

    let counter = 0;

    testData.filter((j) => {

      if (j.AssignedTo == '' & userArr[i] == 'unassigned') { 
 
        counter += 1;

      } else if (j.AssignedTo == userArr[i]) {
        counter += 1;
      }

    });

    CountArr.push(counter);

  }

}

const focusHandler = (focusArea,testData) => { 

  

  for (i = 0; i < focusArea.length;i++) { 
     
    let counter = 0;
    testData.filter((j) => {

      if (j.Focus_Area != '' && j.Focus_Area == focusArea[i]) {
        counter += 1;
      } else if (j.Focus_Area == '' && focusArea[i]=="unassigned") {
        counter += 1;
       }
  
    });

    focusCountArr.push(counter);

  }



}

const incompHandler = (user,testData) => {  
  let tabel = document.getElementById('pending-work').getElementsByTagName('tbody');

  tabel[0].innerHTML = '';
  
  
  testData.map(
    (i) => {
      if (i.Status != "Completed" && user=="All Users") {

        let row = tabel[0].insertRow(0);
        let title = row.insertCell(0);
        let status = row.insertCell(1);
        let expType = row.insertCell(2);
        let assignedTo = row.insertCell(3);
        
        status.innerHTML = i.Status;
        title.innerHTML = i.Title;
        expType.innerHTML = i.Experiment_Type;
        assignedTo.innerHTML = i.AssignedTo;

        
      } else if ( i.Status != "Completed" && i.AssignedTo == user) {
        
        let row = tabel[0].insertRow(0);
        let title = row.insertCell(0);
        let status = row.insertCell(1);
        let expType = row.insertCell(2);
        let assignedTo = row.insertCell(3);
        
        status.innerHTML = i.Status;
        title.innerHTML = i.Title;
        expType.innerHTML = i.Experiment_Type;
        assignedTo.innerHTML = i.AssignedTo;

      } else if ( i.Status != "Completed" &&  i.AssignedTo == ''  && user =="unassigned" ) {
        
        let row = tabel[0].insertRow(0);
        let title = row.insertCell(0);
        let status = row.insertCell(1);
        let expType = row.insertCell(2);
        let assignedTo = row.insertCell(3);
        
        status.innerHTML = i.Status;
        title.innerHTML = i.Title;
        expType.innerHTML = i.Experiment_Type;
        assignedTo.innerHTML = i.AssignedTo;

      }
    }
  );
}
  












