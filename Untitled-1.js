const issueOptions = ['LIFO/FIFO', 'Non Comm', 'RTC Drift and Corrupt', 'Gap Reading Issues', 'Commands get stuck', 'Routing at EP2-54'];

function createSelect(options, className) {
  const select = document.createElement('select');
  select.className = className;
  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    select.appendChild(opt);
  });
  return select;
}

function createIssueRow() {
  const issueRow = document.createElement('div');
  issueRow.className = 'issueRow';

  const labelIssueType = document.createElement('label');
  labelIssueType.textContent = 'Type of Issue:';
  const issueSelect = createSelect(issueOptions, 'issueType');

  const labelCaseCount = document.createElement('label');
  labelCaseCount.textContent = 'Number of Cases:';
  const caseInput = document.createElement('input');
  caseInput.type = 'number';
  caseInput.className = 'caseCount';
  caseInput.placeholder = 'Number of Cases';

  issueRow.appendChild(labelIssueType);
  issueRow.appendChild(issueSelect);
  issueRow.appendChild(labelCaseCount);
  issueRow.appendChild(caseInput);
  return issueRow;
}

function addBreachRow() {
  const breachContainer = document.getElementById('breachContainer');
  const breachSection = document.createElement('div');
  breachSection.className = 'breach-section';

  const labelSlaBreach = document.createElement('label');
  labelSlaBreach.textContent = 'Type of SLA Breach:';
  const slaOptions = ['8hrs LS', '12hrs LS', '24hrs LS', '12hrs DP', '24hrs DP', '15min RC', '15min DC', '6hrs RC', '6hrs DC', '72 Hrs Billing', '168 hrs Billing'];
  const slaSelect = createSelect(slaOptions, 'slaBreach');

  const labelPenaltyAmount = document.createElement('label');
  labelPenaltyAmount.textContent = 'Penalty Amount:';
  const penaltyInput = document.createElement('input');
  penaltyInput.type = 'number';
  penaltyInput.className = 'penaltyAmount';
  penaltyInput.placeholder = 'Penalty Amount';

  const issuesContainer = document.createElement('div');
  issuesContainer.className = 'issuesContainer';

  const addIssueButton = document.createElement('button');
  addIssueButton.type = 'button';
  addIssueButton.textContent = 'Add Issue';
  addIssueButton.onclick = () => {
    issuesContainer.appendChild(createIssueRow());
  };

  breachSection.appendChild(labelSlaBreach);
  breachSection.appendChild(slaSelect);
  breachSection.appendChild(labelPenaltyAmount);
  breachSection.appendChild(penaltyInput);
  breachSection.appendChild(issuesContainer);
  breachSection.appendChild(addIssueButton);
  breachContainer.appendChild(breachSection);
}

document.getElementById('penaltyForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const project = document.getElementById('project').value;
  const breachSections = document.querySelectorAll('.breach-section');
  const penaltyData = [];

  breachSections.forEach(section => {
    const slaBreach = section.querySelector('.slaBreach').value;
    const penaltyAmount = parseFloat(section.querySelector('.penaltyAmount').value) || 0;
    const issueRows = section.querySelectorAll('.issueRow');

    const issues = Array.from(issueRows).map(row => ({
      issueType: row.querySelector('.issueType').value,
      caseCount: parseInt(row.querySelector('.caseCount').value) || 0,
    }));

    penaltyData.push({ project, slaBreach, penaltyAmount, issues });
  });

  fetch('http://localhost:3001/submit-penalty', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(penaltyData)
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('result').innerText = data.message;
    })
    .catch(err => {
      document.getElementById('result').innerText = 'Error submitting penalty data.';
    });
});
