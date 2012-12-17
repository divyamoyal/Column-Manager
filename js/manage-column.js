/*---------------------------------------------------------------\
*
* Filename    : manageColumn.js
* Purpose     : manage dashboard table columns
* Coded By    : Divya Moyal
*
*---------------------------------------------------------------*/
$.fn.manageColumn = (function (columnJson) {

    /*
    *calling functions
    */
    function init() {
        editDialog(); // open edit ui dialog
        columnManager(); // manage controlls of table data, show or hide table columns
        columnCheckbox(); //target table's checkbox change function
        targetBtnAction(); // edit dialog hide and show bottom button
    }
    /*
    *manage controlls of table data, show or hide table columns */
    var targetTable = $('.targetColl');
    var selectedCol; // store current colunm th id
    var indexArr = []; // array of selected colum index by checkbox
    var indexes = 0; // current column index
    var boxId = $(this.selector); // select table container(div) id to apply manage column functionality 
    var boxName = boxId.attr('id'); // select table container(div) name(id)
    var dialogId = $(this.selector + "Dialog"); // dialogue popup related to selected table
    var dialogOpener = $(this.selector + "Opener"); // related dialogue opener button 
   //-------------------------------------------------------------
    /*page load set value of table th from  json*/
    for (var i = 0; i < columnJson.length; i++) {
        boxId.find('table.targetColl th').eq(columnJson[i].count).attr('value', columnJson[i].value);  }
    //-----------------------------------------------------------
    /* on page load hide columns with hidden attribute
    * table's th has an attribute [hidden], if hidden values set as hidden hide columns on page load*/
    console.log(boxId);
    boxId.find('table.targetColl th').each(function () {
        if ($(this).attr('value') == 'hidden') {
            $this = $(this);
            indexes = this.cellIndex; // current table cell index 
            hideCol($this); // calling hide column function
        }
        else if ($(this).attr('value') == 'visible') {
            $this = $(this);
            indexes = this.cellIndex; // current table cell index 
            showCol($this); // calling hide column function
        }
    });

    function columnManager() {
        var cols; // no of columns in table
        //dialodue popup table with show and hide options buttons
        dialogId.find('.accessColl tr .colSpan').click(function (e) {
            e.stopPropagation();
            selectedCol = $(this).attr('idname');
            columnIndex(selectedCol); // function calling manage current column index
        });
    }
    /* 
    * target table witch contain column 
    */
    function columnIndex(selectedCol) {
        boxId.find('table.targetColl th').each(function () {
            if ($(this).attr('idname') == selectedCol) {
                indexes = this.cellIndex;

                $this = $(this);
                if ($(this).css('display') == 'none')
                    showCol($this, selectedCol); // function calling show column
                else
                    hideCol($this, selectedCol); // function calling hide column
            }
        });
    }
    // hide column bye hide link
    function hideCol($this) {
        $this.hide().attr('value', 'hidden');
        boxId.find('table.targetColl tr').each(function () {
            $(this).find('td').eq(indexes).hide();
        });
        dialogId.find('.accessColl tr .colSpan').eq(indexes).html('show').addClass('hdStyle');
    }
    // show column bye show link
    function showCol($this) {
        $this.show().attr('value', 'visible');
        boxId.find('table.targetColl tr').each(function () {
            $(this).find('td').eq(indexes).show();
        });
        dialogId.find('.accessColl tr .colSpan').eq(indexes).html('hide').removeClass('hdStyle');
    }
    /* 
    *target table's checkbox change function
    */
    function columnCheckbox() {
        var cell = 0; //reapeted index in arrayIndex array
        dialogId.find('.accessColl tr input').change(function (e) {
            e.stopPropagation();
            selectedCol = $(this).parent().parent().find('span').attr('idname');
            if ($(this).is(':checked')) {
                boxId.find('table th').each(function () {
                    if ($(this).attr('idname') == selectedCol) {
                        indexArr[indexArr.length] = this.cellIndex;
                    }
                });
            }
            else {
                boxId.find('table.targetColl th').each(function () {
                    if ($(this).attr('idname') == selectedCol) {
                        cell = this.cellIndex;
                        for (var i = 0; i < indexArr.length; i++) {
                            if (indexArr[i] == cell)
                                delete indexArr[indexArr.indexOf(cell)];
                        }
                    }
                });
            }

        });
    }
    /* show and hide function for multiple selected checkbox in dialogue 
    * .hideCol and .showCol are hide and show buttons in dialogue popup footer*/
    function targetBtnAction() {
        $("#"+boxName+"Hide").click(function () {

            for (var i = 0; i < indexArr.length; i++) {
                boxId.find('table.targetColl th').eq(indexArr[i]).attr('value', 'hidden').hide();
                boxId.find('table.targetColl tr').each(function () {
                    $(this).find('td').eq(indexArr[i]).hide();
                });
                dialogId.find('.accessColl tr .colSpan').eq(indexArr[i]).html('show').addClass('hdStyle');
            }
			$('.ui-dialog-titlebar-close').trigger('click');
        });
        $("#"+boxName+"Show").click(function () {
            for (var i = 0; i < indexArr.length; i++) {
                boxId.find('table.targetColl th').eq(indexArr[i]).attr('value', 'visible').show();
                boxId.find('table.targetColl tr').each(function () {
                    $(this).find('td').eq(indexArr[i]).show();
                });
                dialogId.find('.accessColl tr .colSpan').eq(indexArr[i]).html('hide').removeClass('hdStyle');
            }
			$('.ui-dialog-titlebar-close').trigger('click');
        });
    }

    /* dialog by jQuery ui
    * set perameters and create buttons in dialogue popup footer*/
    function editDialog() {
		//var hideBtn=boxId+"hideBtn" ;
		//var showBtn=boxId+"showBtn" ;
		console.log(boxId);
        dialogId.dialog({
            autoOpen: false,
            show: "blind",
            hide: "blind",
            width: 'auto',
            resizable: false
            /*buttons: {
                'hide': {
                    text: 'hide',
                    class: $(this).attr('title'), // apply class to hide button
                    click: function () { $(this).dialog('close') }
                },
                'show': {
                    text: 'show',
                    class: 'showBtn', // apply class to show button
                    click: function () { $(this).dialog('close') }
                }
            }*/
        });
        /* dialogue popup opener button click
        * on click set index array = 0 [remove indexes of show and hide columns]*/
        dialogOpener.click(function () {
            dialogId.dialog("open");
            indexArr.length = 0;
            $('.accessColl input[type="checkbox"]').removeAttr('checked')
            return false;
        });

        $("span.colSpan").button().click(function (event) {
            event.preventDefault();
            //alert('1');
        });
        $('.ui-dialog-titlebar-close').click(function () {
            //again set json value                                                                
            for (var i = 0; i < columnJson.length; i++)
            { columnJson[i].value = boxId.find('table.targetColl th').eq(i).attr('value'); }
            //console.log(columnJson);
        });
    }

    /** main function calling **/
    init();
}); 