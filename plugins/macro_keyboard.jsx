#include "../jsx/main.jsx"
init((new File($.fileName)).parent + '/../');

WORKAREA = '/Users/damu/Pictures/Work Area/'

press_keys = function(keys)
{
  if (conn.open("127.0.0.1:7564")) {
    conn.write('PUT ' + keys + '\n');
    conn.close();
  }
}

customSave = function()
{
  try {
    // This causes exception if not saved before
    var path = activeDocument.path;
    // This blocks, send cmd+s instead
    /*
    var desc = new ActionDescriptor();
    desc.putPath(sTID('in'), new File(path));
    executeAction(sTID("save"), desc, DialogModes.NO);
    */
    press_keys('cmd+s');
  } catch (e) {
    n = Path.uniqueFilename(WORKAREA, Path.simplename(app.activeDocument.name.replace(/-1$/, '').replace(/-Edit$/, '')), '.psb');
    app.activeDocument.saveAsPSB(n);
  }
}

customExport = function(path, size, minsize, color)
{
  size = (size == undefined) ? "x" : size;
  minsize = (minsize == undefined) ? "x" : minsize;
  color = (color == undefined) ? "rgb(0,0,0)" : color;

  var filename = Path.uniqueFilename(path, app.activeDocument.name, '.jpg');
  size = size.split('x');
  minsize = minsize.split('x');
  color = color.substring(4, color.length - 1).replace(/ /g, '').split(',');
  if (!app.activeDocument.saveAsJpeg(filename, parseInt(size[0]), parseInt(size[1]),
                                    parseInt(minsize[0]), parseInt(minsize[1]), color)) {
    alert('Saving ' + filename + ' failed.');
  }
}

solidColorHelper = function()
{
  var l = app.activeDocument.addSolidColorAdjustment('Selection Helper', [0, 255, 0])
  l.opacity = 20;
}

var key = NaN;
var conn = new Socket;

if (conn.open("127.0.0.1:7564")) {
  conn.write("GET\n");
  key = parseInt(conn.read(999999));
  conn.close();
}

switch(key) {
  // Save row
  case 1: app.activeDocument.activeLayer.toggleMaskEnabled(); break;
  case 2: app.activeDocument.activeLayer.showMask(true); break;
  case 3: app.activeDocument.activeLayer.showMaskOverlay(true); break;
  case 5: onSaveLayersClick(); break;
  case 6: customExport("~/Pictures/Processed/"); break;
  case 7: customExport("~/Pictures/Processed/Setups/"); break;
  case 8: customExport("~/Pictures/Processed/Extras/"); break;
  case 9: customExport("~/tmp/", "2048x2048"); break;
  case 10: customExport("~/tmp/4k/", "3840x2160"); break;
  case 11: customSave(); break;
  // Helpers
  case 14: onMakeMemoClick(); break;
  case 15: onMakePerspectiveLinesClick(); break;
  case 16: onMakeSolarisationClick(); break;
  case 17: onMakeSkinCheckerClick(); break;
  case 18: onBlendIfClick(); break;
  case 19: onMakeSaturationMapClick(); break;
  case 20: onMatchTonesClick(); break;
  case 21: onMakeLightnessClick(); break;
  case 23: Photoshop.zoom(7); break;
  case 47: Photoshop.zoom(200); break;
  // Selection
  case 31: Photoshop.selectTool('cropTool'); break;
  case 32: app.activeDocument.inverseSelection(); break;
  case 34: Photoshop.selectTool('marqueeRectTool'); break;
  case 43: app.activeDocument.clearSelection(); break;
  case 30: app.activeDocument.selectAll(); break;
  case 44: Photoshop.selectTool('polySelTool'); break;
  case 45: Photoshop.selectTool('lassoTool'); break;
  case 46: Photoshop.selectTool('magicLassoTool'); break;
  // Undo & Redo
  case 57: Photoshop.undo(); break;
  case 58: app.activeDocument.activeLayer.visible = !app.activeDocument.activeLayer.visible; break;
  case 59: Photoshop.redo(); break;
  case 81: app.activeDocument.activeLayer.addMask(); break;
  case 82: app.activeDocument.addGroup('Group'); break;
  case 83: app.activeDocument.addLayer('Layer'); break;
  // Basic Tools
  case 29: Photoshop.selectTool('curvaturePenTool'); break;
  case 66: Photoshop.selectTool('magicStampTool'); break;
  case 53: Photoshop.selectTool('cloneStampTool'); break;
  case 65: Photoshop.selectTool('spotHealingBrushTool'); break;
  case 77: Photoshop.selectTool('gradientTool'); break;
  case 41: Photoshop.selectTool('typeCreateOrEditTool'); break;
  case 42: Photoshop.selectTool('eraserTool'); break;
  case 13: Photoshop.selectToolPreset('paintbrushTool', 'Hardness 95%'); break;
  case 25: Photoshop.selectToolPreset('paintbrushTool', 'Flow 100%'); break;
  case 24: Photoshop.selectToolPreset('paintbrushTool', 'Flow 10%'); break;
  case 12: Photoshop.selectToolPreset('paintbrushTool', 'Flow 3%'); break;
  case 54: onMakeCleaningClick(); break;
  case 37: app.activeDocument.activeLayer.fill('foregroundColor'); break;
  case 48: Photoshop.swapColors(); break;
  case 36: Photoshop.invert(); break;
  case 49: Photoshop.setDefaultColors(); break;
  case 61: Photoshop.selectTool('moveTool'); break;
  case 64: app.activeDocument.addCurveAdjustment(); break;
  case 52: app.activeDocument.addHueSaturationAdjustment(); break;
  case 63: solidColorHelper(); break;
  // Advanced Tools
  case 26: onMakeFSClick(); break;
  case 38: onCombineDocumentsClick(); break;
  case 50: onUpdateFromUnderClick(); break;
  case 62: onStampUnderClick(); break;
  case 4062: onSmartFromUnderClick(); break;
  case 27: onMakeMatchClick(); break;
  case 39: onFillEmptyClick(); break;
  case 51: onSmartKeepingMaskClick(); break;
  case 28: app.activeDocument.activeLayer.expandMask(); break;
  case 40: app.activeDocument.activeLayer.contractMask(); break;
  // Finishing
  case 56: onHighPassSharpeningClick(); break;
  case 80: onMakeWashOutClick(); break;
  case 79: onMakeVignetteClick(); break;
  case 68: onAddNoiseClick(); break;
  case 67: onMakeDBClick(); break;
  case 55: onMakeCookieClick(); break;

  case isNaN(key):
    alert('Invalid key from the macro keyboard.');
    break;
  default:
    alert('No handler for this key: ' + key);
}
