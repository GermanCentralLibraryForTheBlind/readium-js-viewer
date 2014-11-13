    resetScore(true); //to set the title attributes and the placeholder (or value) attributes for the blanks
    
    //*****the following part should be done in a loop (1st try for loop did not work)
    document.getElementById('blank1').onkeydown = function () {document.getElementById('blank1').style.color = '#000'; resetScore(false);}
    document.getElementById('blank2').onkeydown = function () {document.getElementById('blank2').style.color = '#000'; resetScore(false);}
    document.getElementById('blank3').onkeydown = function () {document.getElementById('blank3').style.color = '#000'; resetScore(false);}
    document.getElementById('blank4').onkeydown = function () {document.getElementById('blank4').style.color = '#000'; resetScore(false);}
    document.getElementById('blank5').onkeydown = function () {document.getElementById('blank5').style.color = '#000'; resetScore(false);}
    document.getElementById('blank6').onkeydown = function () {document.getElementById('blank6').style.color = '#000'; resetScore(false);}
    document.getElementById('blank7').onkeydown = function () {document.getElementById('blank7').style.color = '#000'; resetScore(false);}
    document.getElementById('blank8').onkeydown = function () {document.getElementById('blank8').style.color = '#000'; resetScore(false);}
    document.getElementById('blank10').onkeydown = function () {document.getElementById('blank10').style.color = '#000'; resetScore(false);}
    document.getElementById('blank11').onkeydown = function () {document.getElementById('blank11').style.color = '#000'; resetScore(false);}
    document.getElementById('blank12').onkeydown = function () {document.getElementById('blank12').style.color = '#000'; resetScore(false);}

    document.getElementById('submit-button').onclick = function () {
        assessment(); return false;
    };    
    
    document.getElementById('reset-button').onclick = function () {
        resetScore(true);
    };
    
    function resetScore(resetAll){
    
            var title = [];
            var placeholder = [];
            var blank;
            
            document.getElementById("score-right").innerHTML = "Richtig:";
            document.getElementById("score-wrong").innerHTML = "Falsch:";
            
            title[1] = "'Ihnen' mit kleinem oder großem i?";
            title[2] = "'Sie' mit kleinem oder großem s?";
            title[3] = "'Ihre' mit kleinem oder großem i?";
            title[4] = "'Sie' mit kleinem oder großem s?";
            title[5] = "'Ihrem' mit kleinem oder großem i?";
            title[6] = "'Ihrem' mit kleinem oder großem i?";
            title[7] = "'Ihnen' mit kleinem oder großem i?";
            title[8] = "'Sie' mit kleinem oder großem s?";
            title[9] = "'Uns' mit kleinem oder großem u?";
            title[10] = "'Sie' mit kleinem oder großem s?";
            title[11] = "'Ihre' mit kleinem oder großem i?";
            title[12] = "'Sie' mit kleinem oder großem s?";
            
            placeholder[1]="*hnen";
            placeholder[2]="*ie";            
            placeholder[3]="*hre";
            placeholder[4]="*ie";
            placeholder[5]="*hrem";
            placeholder[6]="*hrem";
            placeholder[7]="*hnen";
            placeholder[8]="*ie";
            placeholder[9]="*ns";
            placeholder[10]="*ie";
            placeholder[11]="*hre";
            placeholder[12]="*ie";
            
            for (i = 1; i != 13; i++){
                 blank = document.getElementById("blank" + i);
                 if (blank.title != "richtig"){
                     blank.title = title[i];
                 }
                 if (resetAll){
                     blank.style.color = '#000';
                     blank.value = "";
                     blank.placeholder = placeholder[i];
                     blank.title = title[i];
                 }
            }
        
    }

    function assessment() {

        var right = 0;
        var wrong = 0;
        var solution = [];
        
        solution [1] = "Ihnen";
        solution [2] = "Sie";
        solution [3] = "Ihre";
        solution [4] = "sie";
        solution [5] = "ihrem";
        solution [6] = "Ihrem";
        solution [7] = "ihnen";
        solution [8] = "Sie";
        solution [9] = "uns";
        solution [10] = "Sie";
        solution [11] = "Ihre";
        solution [12] = "sie";     
     
        for (i=1; i != 13; i++) {
       
            var blank = document.getElementById("blank" + i);
            
            if (!(blank.value == "" || blank.value.indexOf("*")!= -1))
            { 
                if (blank.value == solution[i]) {
                    right += 1;
                    blank.style.color = '#0A0';
                    blank.title = 'richtig';
                } else {
                    wrong += 1;
                    blank.title = 'falsch';
                 blank.style.color = '#A00';
                }
            }
        }
        
        document.getElementById("score-right").innerHTML = "Richtig:" + right;
        document.getElementById("score-wrong").innerHTML = "Falsch:" + wrong;
 }