$(document).ready(function () {

    //show buttons batch add and manual enter
    $('#addContact').on('click', function () {
        $('.add-contact-option').toggle();
    });
    //hide previously showd box when modal opens
    $('#batchImportModal, #manualInsert').on('show.bs.modal', function (e) {
        $('.add-contact-option').hide();
    });
    //clear form on bootstrap modal close

    $('#batchImportModal, #manualInsert, #saveSegment').on('hidden.bs.modal', function (e) {
        $(this).find('input,textarea,select').val('').end();
        $('.custom-file-label').html('Choose file');
    })
    $('input[type="file"]').change(function (e) {
        $('.custom-file-label').html(e.target.files[0].name);
    });
    $('.manualInsertBtn').on('click', function () {
        $(this).attr('disabled', 'disabled');
        var form = $('#manualInsertForm').serialize();
        $(this).children('span').show();
        $('#manualInsert .alert').hide();
        $.ajax({
            type: 'POST',
            url: '/customer/contacts/insertone',
            data: form,
            success: function (data) {
                if(data.status == '200'){
                    $('#manualInsert .saveSuccMsg').text(data.msg).show();
                    $('#manualInsertForm').find('input,textarea,select').val('').end();
                }else{
                    $('#manualInsert .saveFailMsg').text(data.msg).show();
                }
                console.log(data);
                $('.manualInsertBtn').children('span').hide();
            },
            error: function (err) {
                console.log(err)
                alert('Could not save! technical error!!!');
                $('.manualInsertBtn').children('span').hide();
            }
        });
        $(this).removeAttr('disabled');
    });

    $('#pageNavigateForm').on('submit', function (e) {
        e.preventDefault();
        var pageCount = $('#pageStatus').val();
        $('#dataLoadSpinner').append('<div style="width: 100vw;height: 100vh; position: fixed;top:0;left:0;z-index: 1060;background-color: rgba(0,0,0,0.5);" id="spinnerContainer"><div class="spinner-border text-light btn-loader" style="position: absolute;top:50%;left:50%;height:50px;width:50px;"></div></div>');
        $.ajax({
            type: 'POST',
            url: '/customer/contacts',
            data: {page:pageCount},
            success: function (data) {

                if(data.status == 200){
                    var tbl = getDatTable(data);
                    $('#dataTable').html(tbl);
                    $('#totalPages').text(` ${data.totalPages}`);
                    $('#pageStatus').val(data.pageNumber);
                    $('#tableSearch').val('');
                }else{
                    alert('No datda found!');
                }
                $('#spinnerContainer').remove();
            },
            error: function (err) {
                //console.log(err)
                $('#spinnerContainer').remove();
                alert('Error');
            }

        });

        setTimeout(function () {
            tableSearchContent();

        },300)
    });

    //batch import
    $('#batchImportForm').on('submit', function (e) {
        e.preventDefault();
        $('#batchImportBtn').attr('disabled', 'disabled')
        $('#batchImportBtn span').show();
        $('#batchImportForm .alert').hide();
        var fd  = new FormData();
        var file = $('#inputGroupFile')[0].files[0];
        //console.log(file);
        fd.append('file', file)

        $.ajax({
           url: '/customer/contacts/batchinsert',
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function (data) {
               console.log(data);
                if(data.status == 200){
                    $('#batchImportForm .alert-success').text(data.msg).show();
                }else{
                    $('#batchImportForm .alert-danger').text(data.msg).show();
                }
                $('#batchImportBtn span').hide();
                $('#batchImportBtn').removeAttr('disabled');
            },
            error:function(err){
              console.log(err);
                $('#batchImportForm .alert-danger').show();
                $('#batchImportBtn span').hide();
                $('#batchImportBtn').removeAttr('disabled');
              alert('Failed to import');
            }
        });
    });

//    save segment
    $('#save-segment-btn').on('click', function () {

        $('#saveSegment .alert').hide();
        $('#save-segment-btn .btn-loader').show();
        var segmentName = $('#segment-name').val();
        if(segmentName.length > 2){
            var filter = $("#segment-box").structFilter("val");
            if(filter.length > 0){
                $.ajax({
                    type: 'POST',
                    url: '/customer/contacts/savesegment',
                    data: {name: segmentName, data: JSON.stringify(filter)},
                    success: function (data) {
                        console.log(data);
                        if(data.status == 200){
                            $('#saveSegment .alert-success').text(data.msg).show();
                        }else{
                            $('#saveSegment .alert-danger').text(data.msg).show();
                        }
                        $('#save-segment-btn .btn-loader').hide();
                    },
                    error: function (err) {
                        alert('Error saving data!!');
                        $('#save-segment-btn .btn-loader').hide();
                    }
                });
                //post ends
            }else{
                alert('Segment condition is empty');
                $('#save-segment-btn .btn-loader').hide();
            }

        }else{
            alert('Segment name cannot be less than 3 characters');
            $('#save-segment-btn .btn-loader').hide();
        }

    });

});
$(document).on('click', function (e) {
    if($(e.target).closest('.add-contact-option').length === 0 && !$('#addContact').is(e.target)){
        $('.add-contact-option').hide();
    }
});

function tableSearchContent(){
    $('#tableSearch').keyup(function () {
        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

        $('#dataTable tbody tr').show().filter(function() {
            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
            return !~text.indexOf(val);
        }).hide();
    });
}
function getDatTable(data) {
    var tbl = `<thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Joined Date</th>
                        <th>Address</th>
                    </tr>
                </thead><tbody>`;
    data.data.forEach(function(dt){

        tbl += `
                        <tr>
                            <td class="row-edit-buttons">
                                                    <button class="row-edit"><span class="fa fa-edit"></span></button>
                                                </td>
                            <td>${dt.firstname + ' ' + dt.lastname}</td>
                            <td>${dt.mobile}</td>
                            <td>${dt.email}</td>
                            <td>${new Date(dt.dateadded).toISOString().substring(10,0)}</td>
                            <td>${dt.address}</td>
                        </tr>
                    `;
    });
    tbl+='</tbody>';

    return tbl;
}

// function insertOne(form) {
// console.log($("#dateadded").val());
//
// }

