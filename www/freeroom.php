<!--
#########################
This page is a template for adding new pages. Detailed documentation and links to documentation and tutorials can be found at https://github.com/fboyle2001/SixthFormApp/wiki/
#########################
-->
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https: http: 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src * ; script-src 'self' 'unsafe-inline' 'unsafe-eval';"><!-- This is required by PhoneGap to ensure the page can function as if it were a traditional webpage -->
		<script src="./javascript/jquery-3.2.1.min.js"></script><!-- This includes jQuery, a powerful JavaScript framework, in every page. It is strongly recommended you check the documentation out and read a bit about this. It will make things much easier for you when coding in JavaScript for this project -->
		<script src="./javascript/js.cookie.js"></script><!-- A small library used to make handling cookies simple -->
		<script src="cordova.js"></script><!-- This contains some Cordova specific code which is automatically injected by PhoneGap into the directory -->
		<script src="./javascript/settings_loader.js"></script><!-- This is a custom file that loads the settings for the user -->
		<script src="./javascript/query.js"></script><!-- Another custom file that allows interaction with the server via AJAX -->
		<style>
			#periods, table, td, th {
				border: 1px solid black;
				width: 200px;
			}
			#freerooms, table, td, th {
				border: 1px solid black;
				width: 70px
			}
		</style>
		<!-- <link rel="stylesheet" type="text/css" href="SubmitButton.css"> -->
	</head>
	<body>
		<nav><!-- This is the navigation bar, copy and paste a line to link to a new page. Aim to keep it consistent on each page for the user experience. -->
			<ul>
				<a href="home.html"><li id="nav_home">Home</li></a>
				<a href="documents.html"><li id="nav_documents">Documents</li></a>
				<a href="links.html"><li id="nav_links">Links</li></a>
				<a href="freeroom.php"><li id="nav_free_room" class="current">Free Rooms</li></a>
				<a href="student_support.html"><li id="nav_student_support">Student support</li></a>
				<a href="calendar.html"><li id="nav_calendar">Calendar</li></a>
				<a href="settings.html"><li id="nav_settings">Settings</li></a>
			</ul>
		</nav>
		<div class="content"><!-- All of the pages content should be put in here -->
			<h1 class="header">Free Room Information</h1>
			<p>Choose which day and room you wish to check.<p>
			<p>The result will be a table of which periods it is free.<p>
			<p><i>If you would like to see all of the free rooms for a day then leave the room drop down as 'Room'.</i></p>
			
			<table id='periods'>
			<tr><th><strong>Period</strong></th><th><strong>Time</strong></th></tr>
			<tr><td style="text-align:center"><font size="-1"><i>1</i></font></td><td style="text-align:center"><font size="-1"><i>9:00 - 10:00</i></font></td></tr>
			<tr><td style="text-align:center"><font size="-1"><i>2</i></font></td><td style="text-align:center"><font size="-1"><i>10:00 - 11:20</i></font></td></tr>
			<tr><td style="text-align:center"><font size="-1"><i>3</i></font></td><td style="text-align:center"><font size="-1"><i>11:20 - 12:20</i></font></td></tr>
			<tr><td style="text-align:center"><font size="-1"><i>4</i></font></td><td style="text-align:center"><font size="-1"><i>13:30 - 14:30</i></font></td></tr>
			<tr><td style="text-align:center"><font size="-1"><i>5</i></font></td><td style="text-align:center"><font size="-1"><i>14:30 - 15:30</i></font></td></tr>
			</table>
			<p><font size="-2">Please note that the above period time for period 2 and 3 may not accurate as break can be at any time.</font><p>
			<br>
			
			<?php
			function FreeRoom($day,$room) {
				# Connecting to the database
				$servername = "127.0.0.1";
				$username = "user";
				$password = "password";
				$dbname = "id8185190_mcasixapp";
				$conn = mysqli_connect($servername, $username, $password, $dbname);
				
				/*
				# Checking connection
				if ($conn->connect_error) {
					echo 'Connection failed: '.mysqli_connect_error;
				}
				else {
					echo 'Connected successfully';
				}
				*/

				# Checking to see if they haven't entered a day
				if ($room != "") {
					# SQL query for the individual days
					$sql = "SELECT Period FROM Freerooms WHERE Day = '".$day."' AND Room = '".$room."' ORDER BY Room ASC";
					$result = mysqli_query($conn,$sql);
									
					# Outputting the data in a table
					if (mysqli_num_rows($result) > 0) {
						# Output data in each row
						echo '<strong>'.$day.'</strong>';
						echo '<table border=1 id="freerooms"><tr><th><strong>Period</strong></th></tr>'; # Headings
						while($row = mysqli_fetch_assoc($result)) {
							# Individual row
							echo '<tr><td style="text-align:center">'; # Start of the row
							echo $row["Period"]; # Content
							echo '</td></tr>'; # Ending the row
						}
						echo '</table>';
					}
					else {
						echo '<strong>Room: '.$room.' is not free on '.$day.'</strong>';
					}
				}
				else {
					# SQL query for all the free rooms on that day
					$sql = "SELECT Room,Period FROM freerooms WHERE Day = '".$day."' ORDER BY Room ASC";
					$result = mysqli_query($conn,$sql);
					
					# Outputting the data in a table
					if (mysqli_num_rows($result) > 0) {
						# Output data in each row
						echo '<strong>'.$day.'</strong>';
						echo '<table border=1 id="freerooms"><tr><th><strong>Room</strong></th><th><strong>Period</strong></th></tr>'; # Headings
						while($row = mysqli_fetch_assoc($result)) {
							# Individual row
							echo '<tr><td style="text-align:center">'; # Start of the row
							echo $row["Room"].'</td><td style="text-align:center">'.$row["Period"]; # Content
							echo '</td></tr>'; # Ending the row
						}
						echo '</table>';
					}
					else {
						echo '<strong>There are no free rooms on '.$day.'</strong>';
					}
				}
				$conn->close();
			}
			# If the form/button has been pressed run the above with the correct day
			if(isset($_POST['day'])) {
				FreeRoom($_POST["Day"],$_POST["Room"]);
			}
			?>
			<br>

			<!-- Setting the size of the box around the form -->
			<style>
			fieldset {
				padding:5px;
				width:325px;}
			</style>
			
			<!-- Creating each of the options for the form -->
			<form action = "freeroom.php" method="post">
			<fieldset> <!-- Creating a box around the form -->
			 <!-- Creating the drop down box -->
			 <select name="Day" value="Day"> 
				<option value="Monday">Monday</option>
				<option value="Tuesday">Tuesday</option>
				<option value="Wednesday">Wednesday</option>
				<option value="Thursday">Thursday</option>
				<option value="Friday">Friday</option>
			 </select>
			 <!-- The entry field for the room -->
			 <?php # Connecting to the database
				$servername = "127.0.0.1";
				$username = "user";
				$password = "password";
				$dbname = "id8185190_mcasixapp";
				$conn = mysqli_connect($servername, $username, $password, $dbname);
				$sql = "SELECT DISTINCT Room FROM Freerooms ORDER BY Room ASC";
				$result = mysqli_query($conn,$sql);
				# Outputting the data in a drop down list
				if (mysqli_num_rows($result) > 0) {
					# Output data in each row
					echo '<select name="Room" value="Room">';
					echo '<option value="">Room</option>';
					while($row = mysqli_fetch_assoc($result)) {
						# Individual option
						echo '<option value="'.$row["Room"].'">'.$row["Room"].'</option>'; # each option
					}
					echo '</select>';
				}	
			?>	
			 <input type="submit" name="day" value="Submit">
			</fieldset>
			</form> <br>
			
			<!-- Button to clear the data which will be rewritten/removed later in development/testing -->
			<form action = "freeroom.php" method="post">
			 <input type="submit" name="clear" value="Clear">
			</form>
			
		</div>
	</body>
</html>
