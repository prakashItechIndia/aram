using System.Web;
using System.Web.Optimization;

namespace E_Challan
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));


            // The jQuery bundle
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                            "~/Scripts/jquery-1.*"));


            // The Kendo JavaScript bundle
            bundles.Add(new ScriptBundle("~/js/kendo").Include(
                    "~/js/kendo.all.*", // or kendo.all.* if you want to use Kendo UI Web and Kendo UI DataViz
                    "~/js/kendo.aspnetmvc.*"
                //"~/js/jquery.min.js"
                    ));
            //"~/js/kendo.dataviz.min.js"));


            // The Kendo CSS bundle
            bundles.Add(new StyleBundle("~/Css/kendo").Include(
                    "~/styles/kendo.common.*",
                    "~/styles/kendo.default.*"));
            // "~/styles/kendo.dataviz.min.css"));


            // Clear all items from the ignore list to allow minified CSS and JavaScript files in debug mode
            bundles.IgnoreList.Clear();


            // Add back the default ignore list rules sans the ones which affect minified files and debug mode
            bundles.IgnoreList.Ignore("*.intellisense.js");
            bundles.IgnoreList.Ignore("*-vsdoc.js");
            bundles.IgnoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);

            bundles.Add(new StyleBundle("~/FrameWork_Css/pack1").Include(
                "~/FrameWork_Css/bootstrap.min.css",
                "~/FrameWork_Css/prettyCheckable.css",
                "~/FrameWork_Css/font-awesome.min.css",
                "~/FrameWork_Css/ace-fonts.css",
                "~/FrameWork_Css/ace.min.css",
                "~/FrameWork_Css/ace-rtl.min.css",
                "~/FrameWork_Css/ace-skins.min.css",
                "~/FrameWork_Css/kendoGrid.css"
                ));

            bundles.Add(new ScriptBundle("~/Framework_js/pack1js").Include(
               "~/Framework_js/bootstrap.min.js",
               "~/Framework_js/typeahead-bs2.min.js",
               "~/Framework_js/jquery-ui-1.10.3.custom.min.js",
               "~/Framework_js/jquery.ui.touch-punch.min.js",
               "~/Framework_js/jquery.slimscroll.min.js",
               "~/Framework_js/jquery.easy-pie-chart.min.js",
               "~/Framework_js/jquery.sparkline.min.js",
               "~/Framework_js/ace-extra.min.js",
               "~/Framework_js/ace-elements.min.js",
               "~/Framework_js/ace.min.js",
                /*"~/Framework_js/flot/jquery.flot.min.js",
                "~/Framework_js/flot/jquery.flot.pie.min.js",
                "~/Framework_js/flot/jquery.flot.resize.min.js",
                 "~/Framework_js/flot/jquery.flot.resize.min.js",*/
                "~/Framework_js/kendoGrid.js",
                "~/FrameWork_Js/prettyCheckable.js"));

        }
    }
}