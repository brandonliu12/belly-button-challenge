// Fetch the JSON data and console log it
const roadster = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

d3.json(roadster).then(function(data) {

  function updateDashboard(id, data) {
    let sample = data.samples.filter(sample => sample.id === id)[0];
    let metadata = data.metadata.filter(meta => meta.id == id)[0];

    // Update metadata
    let sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html("");
    Object.entries(metadata).forEach(([key, value]) => {
      sampleMetadata.append("p").text(`${key}: ${value}`);
    });

    // Bar Chart
    let trace1 = {
      x: sample.sample_values.slice(0, 10).reverse(),
      y: sample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: sample.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };
    let barData = [trace1];
    Plotly.newPlot("bar", barData);

    // Bubble Chart
    let trace2 = {
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: 'markers',
      marker: {
        color: sample.otu_ids,
        size: sample.sample_values
      }
    };
    let bubbleData = [trace2];
    Plotly.newPlot('bubble', bubbleData);

    // Gauge Chart
    let trace3 = {
      type: "indicator",
      mode: "gauge+number",
      value: metadata.wfreq,
      title: { text: "Belly Button Washing Frequency <br> Scrubs per Week", font: { size: 18 } },
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "transparent",
        steps: [
          { range: [0, 1], color: 'rgba(232, 226, 202, .5)' },
          { range: [1, 2], color: 'rgba(210, 206, 145, .5)' },
          { range: [2, 3], color: 'rgba(177, 127, 38, .5)' },
          { range: [3, 4], color: 'rgba(147, 108, 54, .5)' },
          { range: [4, 5], color: 'rgba(103, 76, 71, .5)' },
          { range: [5, 6], color: 'rgba(102, 79, 59, .5)' },
          { range: [6, 7], color: 'rgba(131, 90, 45, .5)' },
          { range: [7, 8], color: 'rgba(170, 128, 40, .5)' },
          { range: [8, 9], color: 'rgba(202, 178, 214, .5)' }
        ],
      }
    };
    let gaugeData = [trace3];
    Plotly.newPlot('gauge', gaugeData);
  }

  // Populate the dropdown
  let dropdown = d3.select("#selDataset");
  data.names.forEach(name => {
    let option = dropdown.append("option");
    option.text(name);
    option.property("value", name);
  });

  // Update the dashboard when a new option is selected
  dropdown.on("change", function() {
    let newId = d3.select(this).property("value");
    updateDashboard(newId, data);
  });

  // Update the dashboard with the first sample
  updateDashboard(data.names[0], data);
});
