function addStyleSelectedGrid() {
    $(".k-grid table tr td:first-child input:checkbox").each(function () {
        if ($(this).is(":checked")) {
            $(this).parent("td").parent("tr").addClass("selected");
        }
    });
}