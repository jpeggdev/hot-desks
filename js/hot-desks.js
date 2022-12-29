function ShowHotDesks(Json, Location) {
  const Statuses = Json.Statuses;
  const Users = Json.Users.filter((User) => User.Location === Location);
  const Reservations = Json.Reservations.filter(
    (Reservation) => Reservation.Location === Location
  );

  var output = [];
  Reservations.forEach((reservation) => {
    let desk = reservation.Desk;
    let statusList = LoadStatusList(desk, Statuses, reservation.Status);
    let userList = LoadUserList(desk, Users, reservation.User);

    output.push(
      CreateHotDesk(
        reservation.Desk,
        userList,
        statusList,
        reservation.StatusCssClass
      )
    );
  });
  return output.join('');
}

function CreateHotDesk(Desk, UserList, StatusList, StatusCssClass) {
  let h = [];
  h.push(`<div ID="${Desk}" class="hot-desk ${StatusCssClass}">`);
  h.push(`<div class="hot-desk-id">${Desk}</div><br />`);
  h.push(UserList);
  h.push('<br />');
  h.push(StatusList);
  h.push(`</div>`);
  return h.join('');
}

function LoadUserList(Desk, Userlist, User) {
  var select = [];
  select.push(`<select ID="UserList${Desk}" class="hot-desk-user-list">`);
  select.push("<option value=''></option>");
  Userlist.forEach((thisUser, index) => {
    select.push(
      `<option value="${thisUser.UserID}"${
        thisUser.Name === User ? ' selected' : ''
      }>${thisUser.Name}</option>`
    );
  });
  select.push(`</select>`);
  return select.join('');
}

function LoadStatusList(Desk, StatusList, Status) {
  var select = [];
  select.push(`<select ID="StatusList${Desk}" class="hot-desk-status-list}">`);
  StatusList.forEach((thisStatus, index) => {
    select.push(
      `<option value="${thisStatus.StatusID}"${
        thisStatus.Name === Status ? ' selected' : ''
      }>${thisStatus.Name}</option>`
    );
  });
  select.push(`</select>`);
  return select.join('');
}

function LoadLocationList(Locationlist) {
  var select = [];
  select.push(`<select class="hot-desk-location-list">`);
  Locationlist.forEach((thisLocation, index) => {
    select.push(
      `<option value="${thisLocation.LocationID}">${thisLocation.Name}</option>`
    );
  });
  select.push(`</select>`);
  return select.join('');
}

async function LoadHotDesks() {
  const response = await fetch('/data/hot-desks.json');
  const data = await response.json();
  return data;
}

document.addEventListener(
  'DOMContentLoaded',
  async function () {
    let hotDesksList = document.querySelector('#hot-desks-list');
    let locationSelect = document.querySelector('#hot-desk-location-list');

    var Location = 'Tulsa';

    var hotDeskJson = await LoadHotDesks();
    locationSelect.innerHTML = LoadLocationList(hotDeskJson.Locations);
    locationSelect.addEventListener('change', async function () {
      Location = this.options[this.selectedIndex].text;
      hotDesksList.innerHTML = ShowHotDesks(hotDeskJson, Location);
    });

    hotDesksList.innerHTML = ShowHotDesks(hotDeskJson, Location);
  },
  false
);
