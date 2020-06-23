$(document).ready(function () {

    //selecting row
    $('#dataTable td').on('click', function () {
        if($(this).hasClass('row-edit-buttons')){
            return false;
        }
        $(this).parent().toggleClass('selected-row');
       // $(this).toggleClass('selected-row');
    });

    //edit
    $('.batch-edit').on('click', function () {
        if($('.selected-row').length<1) alert('No row selected');
        //get all the selected element and show in form one by one to edit.
    });
    $('.batch-delete').on('click', function () {
        if($('.selected-row').length<1) alert('No Row Selected!');
        else{
            //temporary deleting from table
            //in actual perform ajax request and delete.
            $('.selected-row').remove();
        }
    })
})