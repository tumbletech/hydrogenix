document.addEventListener("DOMContentLoaded", function () {
    let tankShape = document.getElementById("tankShape");
    let requiredVolume = document.getElementById("requiredVolume");
    let remarks = document.getElementById("volumeRemarks");
    let airgapHeight = document.getElementById("airgapHeight");

    if (tankShape) tankShape.addEventListener("change", () => {
        toggleShapeInputs();
        if (remarks) remarks.innerHTML = "";
    });

    if (requiredVolume) requiredVolume.addEventListener("input", compareVolumes);
    if (airgapHeight) airgapHeight.addEventListener("input", calculateGrossVolume);

    let rectInputs = ["rectHeight", "rectLength", "rectWidth", "rectHeightUnit", "rectLengthUnit", "rectWidthUnit"];
    rectInputs.forEach(id => {
        let element = document.getElementById(id);
        if (element) element.addEventListener("input", () => {
            calculateRectangularVolume();
            compareVolumes();
            calculateGrossVolume();
        });
    });

    let cylInputs = ["cylDiameter", "cylHeight", "cylDiameterUnit", "cylHeightUnit"];
    cylInputs.forEach(id => {
        let element = document.getElementById(id);
        if (element) element.addEventListener("input", () => {
            calculateCylindricalVolume();
            compareVolumes();
            calculateGrossVolume();
        });
    });
});

function toggleShapeInputs() {
    let shape = document.getElementById("tankShape")?.value;
    let rectangularInputs = document.getElementById("rectangularInputs");
    let cylindricalInputs = document.getElementById("cylindricalInputs");
    let remarks = document.getElementById("volumeRemarks");

    if (rectangularInputs) rectangularInputs.style.display = "none";
    if (cylindricalInputs) cylindricalInputs.style.display = "none";
    if (remarks) remarks.innerHTML = ""; // Clear remarks when switching shapes

    if (shape === "rectangular" && rectangularInputs) {
        rectangularInputs.style.display = "block";
    } else if (shape === "cylindrical" && cylindricalInputs) {
        cylindricalInputs.style.display = "block";
    }

    // Reset volume output when switching shape
    let rectVolumeOutput = document.getElementById("rectVolumeOutput");
    let cylVolumeOutput = document.getElementById("cylVolumeOutput");
    
    if (rectVolumeOutput) rectVolumeOutput.innerText = "N/A";
    if (cylVolumeOutput) cylVolumeOutput.innerText = "N/A";

    compareVolumes();
}

function calculateRectangularVolume() {
    let height = parseFloat(document.getElementById("rectHeight")?.value) || 0;
    let length = parseFloat(document.getElementById("rectLength")?.value) || 0;
    let width = parseFloat(document.getElementById("rectWidth")?.value) || 0;

    let volume = height * length * width;
    let volumeOutput = document.getElementById("rectVolumeOutput");
    if (volumeOutput) volumeOutput.innerText = volume.toFixed(2) + " ft³";

    compareVolumes();
}

function calculateCylindricalVolume() {
    let diameter = parseFloat(document.getElementById("cylDiameter")?.value) || 0;
    let height = parseFloat(document.getElementById("cylHeight")?.value) || 0;
    let radius = diameter / 2;
    let volume = Math.PI * Math.pow(radius, 2) * height;
    let volumeOutput = document.getElementById("cylVolumeOutput");
    if (volumeOutput) volumeOutput.innerText = volume.toFixed(2) + " ft³";
    compareVolumes();
}

function compareVolumes() {
    let requiredVolume = parseFloat(document.getElementById("requiredVolume")?.value) || 0;
    let rectVolume = parseFloat(document.getElementById("rectVolumeOutput")?.innerText.replace(" ft³", "")) || 0;
    let cylVolume = parseFloat(document.getElementById("cylVolumeOutput")?.innerText.replace(" ft³", "")) || 0;
    let designVolume = Math.max(rectVolume, cylVolume);
    let remarks = document.getElementById("volumeRemarks");

    if (!remarks) return;

    if (requiredVolume > 0 && designVolume > 0) {
        let percentDifference = ((designVolume - requiredVolume) / requiredVolume) * 100;
        percentDifference = percentDifference.toFixed(2);

        if (designVolume < requiredVolume) {
            remarks.innerHTML = `<span class="text-danger">⚠️ Design volume is ${Math.abs(percentDifference)}% LESS than the required volume. Increase dimensions.</span>`;
        } else if (designVolume > requiredVolume) {
            remarks.innerHTML = `<span class="text-success">✅ Design volume is ${Math.abs(percentDifference)}% GREATER than the required volume. You may reduce dimensions.</span>`;
        } else {
            remarks.innerHTML = `<span class="text-primary">✔ Design volume matches the required volume. Good to proceed!</span>`;
        }
    } else {
        remarks.innerHTML = `<span class="text-warning">Enter required volume to compare with the design volume.</span>`;
    }

    calculateGrossVolume(); // Ensure that gross volume is updated after comparing volumes
}

// ✅ Correctly Defined Function for Gross Volume Calculation
function calculateGrossVolume() {
    let airgap = parseFloat(document.getElementById("airgapHeight")?.value) || 0;
    let rectHeight = parseFloat(document.getElementById("rectHeight")?.value) || 0;
    let rectLength = parseFloat(document.getElementById("rectLength")?.value) || 0;
    let rectWidth = parseFloat(document.getElementById("rectWidth")?.value) || 0;
    let cylHeight = parseFloat(document.getElementById("cylHeight")?.value) || 0;
    let cylDiameter = parseFloat(document.getElementById("cylDiameter")?.value) || 0;
    let grossVolumeOutput = document.getElementById("grossVolumeValue");

    let grossVolume = 0;
    if (rectHeight > 0) {
        grossVolume = (rectHeight + airgap) * rectLength * rectWidth;
        dimensionsText = `Final Dimensions: ${rectLength} ft x ${rectWidth} ft x ${(rectHeight + airgap).toFixed(2)} ft`;
    } else if (cylHeight > 0) {
        let radius = cylDiameter / 2;
        grossVolume = Math.PI * Math.pow(radius, 2) * (cylHeight + airgap);
        dimensionsText = `Final Dimensions:\nR = ${radius.toFixed(2)} ft\nH = ${(cylHeight + airgap).toFixed(2)} ft`;
    }

    if (grossVolumeOutput) {
        grossVolumeOutput.innerText = `${grossVolume.toFixed(2)} ft³`;
    }

    if (finalDimensionsOutput) {
        finalDimensionsOutput.innerText = `${dimensionsText}\n(Plus ${airgap} ft of airgap)`;
    }
}
