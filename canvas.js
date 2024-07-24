///////////////////////////////////////////////////////////////////////////////////////

function draw() {
  var val = document.getElementById("select_graph").value;
  switch (val) {
    case 'points':
      draw_points_graph();
      break;
    case 'con_points':
      draw_connected_points_graph();
      break;
    case 'pie_chart':
      draw_pie_chart();
      break;
    default:
      draw_column_graph();
      break;
  }
}

///////////////////////////////////////////////////////////////////////////////////////

function init_js() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  change_form();
  draw_intro(canvas, ctx);
}

function draw_intro(canvas, ctx) {
  ctx.font = '40px serif';
  ctx.fillText('Canvas API', 300, 150);
  ctx.font = '20px serif'
  ctx.fillText('To highlight certain values, fill column in format: Name_1,...,Name_n', 120, 200);
  ctx.fillText('Long names will be mercilessly cut down...', 220, 250);
}

function change_form() {
  var val = document.getElementById("select_values").value;
  for (let k = 1; k <= 10; k++)
  {
    var id = "";
    id = id.concat("input", k.toString());
    var elem = document.getElementById(id);
    if (k <= val)
    {
      elem.style.display =  'unset';
    }
    else
    {
      elem.style.display =  'none';
    }
  }
}

function clear_canvas(ctx) {
  console.log("Cleaning up...");
  const canvas = document.getElementById("canvas");
  const contx = canvas.getContext("2d");
  contx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_column_graph() {
  draw_axies_graph("column");
}

function draw_points_graph() {
  draw_axies_graph("points");
}

function draw_connected_points_graph() {
  draw_axies_graph("connected_points");
}

function draw_axies_graph(variation) {
  console.log("Drawing...")
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let base_padding_bt = 50;
  let base_padding_r = 50;
  let base_padding_l = 80;
  const pairs = get_values();
  const names = pairs[0];
  const vals = pairs[1];
  var max_val = arr_max_val(vals);

  // DRAWING
  var repr_unit = create_graph_base(canvas, ctx, base_padding_bt, base_padding_r, base_padding_l, max_val);
  if (repr_unit != 0) {
    max_val = 12;
  }
  draw_axies_guts(canvas, ctx, repr_unit, variation, names, vals, max_val, base_padding_bt, base_padding_r, base_padding_l); 
}

function draw_axies_guts(canvas, ctx, repr_unit, variation, names, vals, max_val, base_padding_bt, base_padding_r, base_padding_l) {
  var hl = document.getElementById("highlight");
  var highlights = [];
  if (hl.value) {
    highlights = hl.value.split(',');
  }
  var w_beginning = base_padding_l;
  var w_end = canvas.width - base_padding_r;
  var w_unit = (w_end - w_beginning) / (vals.length + 1);
  var h_beggining = base_padding_bt;
  var h_end = canvas.height - base_padding_bt;
  var h_unit = (h_end - h_beggining) / max_val;

  ctx.font = '20px serif';
  for (let k = 1; k <= names.length; k++) {
    var name = names[k-1];
    if (name.length > w_unit / 10) {
      name = name.substring(0, w_unit / 10);
    }
    ctx.fillText(name, (w_beginning + k*w_unit) - name.length * 5, h_end + (base_padding_bt / 2));
  }
  if (variation == "connected_points")
    ctx.beginPath();

  for (let k = 1; k < vals.length+1; k++) {
    if (highlights.includes(names[k-1])) {
      ctx.fillStyle = 'red';
    }
    var x = w_beginning + k * w_unit;
    var y = ((max_val - (vals[k-1] / repr_unit)) * h_unit) + base_padding_bt;

    switch (variation) {
      case 'points':
        ctx.fillRect(x,y,10,10);
        break;
      case 'connected_points':
        ctx.fillRect(x-5,y-5,10,10);
        ctx.lineTo(x,y);
        break;
      default:
          var col_height = canvas.height - (2*base_padding_bt) - ((max_val - (vals[k-1] / repr_unit)) * h_unit);
          ctx.fillRect(x - w_unit/3, y, (w_unit/3)*2, col_height - 1);

        break;
    }
    ctx.fillStyle = 'black';
  }
  if (variation == "connected_points")
    ctx.stroke();

}

function get_values() {
  var count = document.getElementById("select_values").value;
  var names = [];
  var vals = [];
  for (let k = 1; k <= count; k++)
  {
    var name = "text";
    name = name.concat(k.toString());
    var name_k = document.getElementById(name);
    names.push(name_k.value);

    var val = "val";
    val = val.concat(k.toString());
    var val_k = document.getElementById(val).value;
    vals.push(parseInt(val_k));
  }
  var res = [names,vals];
  return res;
}

function arr_max_val(arr) {
  if (arr.length < 1) {
    return 0;
  }
  var max_elem = arr[0];

  for (let k = 0; k < arr.length; k++) {
    if (arr[k] > max_elem)
    {
      max_elem = arr[k];
    }
  }
  return max_elem;
}

function create_graph_base(canvas, ctx, base_padding_bt, base_padding_r, base_padding_l, max_value) {
  var scale = false;
  var repr_unit = 0;
  if (max_value > 20) {
    scale = true;
    var repr_unit = max_value / 12;
    max_value = 12;
  }

  ctx.beginPath();
  ctx.moveTo(canvas.width - base_padding_r, canvas.height - base_padding_bt);
  ctx.lineTo(base_padding_l, canvas.height - base_padding_bt);
  ctx.lineTo(base_padding_l, base_padding_bt);
  
  var unit = (canvas.height - (2 * base_padding_bt)) / max_value;
  var marker_width = 10;
  ctx.moveTo(base_padding_l, canvas.height - base_padding_bt);
  ctx.font = '15px serif'

  for (let k = 0; k <= max_value; k++) {
    let act_h = (canvas.height - base_padding_bt) - (k * unit);
    ctx.moveTo(base_padding_l + marker_width / 2, act_h);
    ctx.lineTo(base_padding_l - marker_width /2, act_h);
    if (scale) {
      ctx.fillText((Math.round(k*repr_unit)).toString(), base_padding_l - 35, act_h + 4);
    }
    else {
      ctx.fillText(k.toString(), base_padding_l - 35, act_h + 4);
    }
    
  }
  ctx.stroke();
  return repr_unit;
}








function draw_pie_chart() {
  console.log("Drawing...")
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const pairs = get_values();
  const names = pairs[0];
  const vals = pairs[1];
  
  const radius = 170;
  const colors = ['red', 'blue', 'brown', 'purple', 'orange', 'grey', 'yellow', 'green', 'black', 'turquoise'];
  const center_x = (canvas.width / 3) * 2;
  const center_y = canvas.height / 2;
  const full_circle = Math.PI * 2; //rad
  const portions = determine_perc_from_whole(vals);
  const labels = create_labels(names, vals, portions);
  const perc_arc = full_circle / 100

  var prev_arc_end = 0;
  for (let k = 0; k < labels.length; k++) {
    ctx.beginPath();
    var act_portion = portions[k] * perc_arc;
    ctx.arc(center_x, center_y, radius, prev_arc_end, prev_arc_end + act_portion, false);
    ctx.lineTo(center_x, center_y);
    prev_arc_end += act_portion;
    ctx.fillStyle = colors[k];
    ctx.fill();
  }
  draw_labels(canvas, ctx, colors, labels);
}

function determine_perc_from_whole(vals) {
  var sum = 0;
  for (let k = 0; k < vals.length; k++) {
    sum += vals[k];
  }
  var res = [];
  var all_but_one = 0;
  for (let k = 0; k < vals.length - 1; k++) {
    var perc = Math.round((vals[k] / sum) * 100);
    res.push(perc);
    all_but_one += perc;
  }
  res.push(100 - all_but_one);

  return res;
}

function create_labels(names, vals, portions) {
  var res = [];
  for (let k = 0; k < names.length; k++) {
    var temp = "";
    res.push(temp.concat(names[k], ", ", vals[k], " (", portions[k], "%)"));
  }
  return res;
}

function draw_labels(canvas, ctx, colors, labels) {
  ctx.font = '20px serif';
  var padding_left = 50;
  var unit = canvas.height / (labels.length + 1);

  for (let k = 1; k <= labels.length; k++) {
    ctx.fillStyle = colors[k-1];
    ctx.fillRect(padding_left, k*unit, 15, 15);
    ctx.fillStyle = 'Black';
    ctx.fillText(labels[k-1], padding_left + 30, k*unit + 13);
  }
}