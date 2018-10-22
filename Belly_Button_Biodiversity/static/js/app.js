function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
  
    // Use `d3.json` to fetch the metadata for a sample
    d3.json("/metadata/" + sample).then(function(data) {

      // Use d3 to select the panel with id of `#sample-metadata`
      panel = d3.select("#sample-metadata");
        
      // Use `.html("") to clear any existing metadata
      panel.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(sample).forEach(([key, value]) => {
        var row = sample_metadata.append("p");
        row.text(`${key}: ${value}`);
  
      })
    })
  };
      
  
  function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json("/samples/" + sample).then(function(data){

  
      // @TODO: Build a Bubble Chart using the sample data
    //*Use `otu_ids` for the x values
    //* Use `sample_values` for the y values
    //* Use `sample_values` for the marker size
    //* Use `otu_ids` for the marker colors
    //* Use `otu_labels` for the text values

    var xValues = data.otu_ids;
    var yValues = data.sample_values;
    var mSize = data.sample_values;
    var mClrs = data.otu_ids;
    var tValues = data.otu_labels;

    var trace_bubble = {
      x: xValues,
      y: yValues,
      text: tValues,
      mode: 'markers',
      marker: {
        size: mSize,
        color: mClrs
      }
    };

    var data = [trace_bubble];

    var layout = {
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot('bubble', data, layout);

  });
};


  
      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).

      //* Use `sample_values` as the values for the PIE chart
      //* Use `otu_ids` as the labels for the pie chart
      //* Use `otu_labels` as the hovertext for the chart

  d3.json("pie").then(function(data) {
    var pvalue = data.sample_values.slice(0,10);
    var plabel = data.otu_ids.slice(0, 10);
    var phovertext = data.otu_labels.slice(0, 10);
  
    var data = [{
      values: pvalue,
      labels: plabel,
      hovertext: phovertext,
      type: 'pie'
    }];

    var layout = {
      title: 'Belly Button Biodiversity Pie Chart',
    };
  

    Plotly.newPlot('pie', data, layout);
});
  

    
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
  