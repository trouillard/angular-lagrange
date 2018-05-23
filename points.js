// points.js
'use strict';


var pointsModule = angular.module('pointsModule',[]);

pointsModule.controller('pointsModuleCtrl', ['$scope',

    function ($scope) {

		// DECLARATION / INITIALISATION

		 // Initialisation variables double binding
			$scope.pointsAvant = [ ];
			$scope.pointCoursS = false;
			$scope.pointCoursP = 1;
			$scope.pointCoursX = '';
			$scope.pointCoursY = '';
			$scope.pointsApres = [ ];
			$scope.simuX	   = '';
			$scope.simuY	   = '';

		 // D�claration variables travail traitements Java Script
			var pointsAvant;
			var pointCoursS;
			var pointCoursP;
			var pointCoursX;
			var pointCoursY;
			var pointsApres;
			var position;
			var simuX;
			var simuY;

		// SOUS-FONCTION - r�cup�ration donn�es double binding
		$scope.recuperation = function () {

			pointsAvant = $scope.pointsAvant;

			pointCoursX = $scope.pointCoursX;
			pointCoursP = $scope.pointCoursP;
			pointCoursX = $scope.pointCoursX;
			pointCoursY = $scope.pointCoursY;

			pointsApres = $scope.pointsApres;

			simuX 		= $scope.simuX;
			simuY 		= $scope.simuY;
		}

		// SOUS-FONCTION - affectation donn�es double binding
		$scope.affectation = function (
										pointsAvant,
										pointCoursS,
										pointCoursP,
										pointCoursX,
										pointCoursY,
										pointApres,
										simuX,
										simuY
									  ) {

			$scope.pointsAvant	= pointsAvant;

			$scope.pointCoursS	= pointCoursS;
			$scope.pointCoursP	= pointCoursP;
			$scope.pointCoursX	= pointCoursX;
			$scope.pointCoursY	= pointCoursY;

			$scope.pointsApres	= pointsApres;

			$scope.simuX		= simuX;
			$scope.simuY		= simuY;
		}


		// SOUS-FONCTION - recherche position premier point s�lectionn� (et d�lection des suivants)
		$scope.selection = function () {

			 // Position pas encore d�finie
				position = null;

			 // Boucle sur la liste des points avant
				for (var point of pointsAvant) {

				 // Si la position n est pas encore trouv�e
					if (position == null) {

					 // On regarde si premi�re position coch�e
						if (point.S == true) {
						 // On note la premi�re position coch�e - C est la retenue
							position = point.P;
						}
					}
				 // Position d�j� trouv�e on remet les booleens s�lection � false
					else {
							point.S = false;
					}
				}

			 // Boucle sur la liste des points apr�s
				for (var point of pointsApres) {

				 // Si la position n est pas encore trouv�e
					if (position == null) {

					 // On regarde si premi�re position coch�e
						if (point.S == true) {
						 // On note la premi�re position coch�e - C est la retenue
							position = point.P;
						}
					}
				 // Position d�j� trouv�e on remet les booleens s�lection � false
					else {
							point.S = false;
					}
				}
		}


		// FONCTION - Ajout point
		$scope.upsertPoint = function () {

		 // R�cup�ration donn�es double binding
		 	$scope.recuperation();

		 // Lavage des donn�es saisies
			pointCoursX = pointCoursX.trim();
			pointCoursY = pointCoursY.trim();

		 // Test si donn�es � niveau
			if (pointCoursX != '' && pointCoursY != '' && !isNaN(pointCoursX) && !isNaN(pointCoursY)) {

			 // Ajout du point en fin de tableau des points avant
				pointsAvant.push({
									S: false,
									P: pointCoursP,
									X: pointCoursX,
									Y: pointCoursY
								});

			 // Ajout des points du tableau apr�s en mettant les positions � jour
				var position = pointCoursP + 1;
				for (var point of pointsApres) {
					point.P = position
					pointsAvant.push(point);
					position++;
				}

			 // Vidage des points apr�s
				pointsApres = [ ];

			 // Ajustement variables double binding
				$scope.affectation (
										pointsAvant,
										false,
										pointsAvant.length + 1,
										'',
										'',
										pointsApres,
										'',
										''
									);
			}
			else {
			 // Si donn�es entr�es pas � niveau
				alert("X and Y must be numeric");
			}

		 // Focus sur la zone de saisie X
			document.getElementById("SaisieX").focus();
		};


		// FONCTION - Suppression point(s)
		$scope.removePoints = function () {

		 // R�cup�ration donn�es double binding
		 	$scope.recuperation();

		 // Boucle sur les points avant (pas de points apr�s) : on supprime les points s�lectionn�s
			var decalage = 0;
			var i = 0;
			do {
			 // Si selectionne on enl�ve le point
				if (pointsAvant[i].S == true) {
					pointsAvant.splice(i, 1);
					decalage = decalage + 1;
					i--;
				}
				else {
				 // on reajuste la position en fonction des points pr�c�demment enleves sauf quand on supprime le dernier element
					pointsAvant[i].P = pointsAvant[i].P - decalage;
				}
				i++;
			}
			while (i < pointsAvant.length);

		 // MAJ donn�es double binding avec red�finition du curseur sur le point de travail
			pointCoursP = $scope.pointCoursP = pointsAvant.length + pointsApres.length + 1;
			$scope.affectation (
									pointsAvant,
									false,
									pointsAvant.length + 1,
									'',
									'',
									[],
									'',
									''
								);

		 // Focus sur la zone de saisie X
			document.getElementById("SaisieX").focus();
		};


		// FONCTION - Selection point
		$scope.selectPoint = function () {

			 // R�cup�ration donn�es double binding
				$scope.recuperation();

			 // Recherche point s�lectionn�
				$scope.selection();

			 // Affectation donn�es double binding focntion position s�lection
				var points = pointsAvant.concat(pointsApres);
				$scope.affectation (
										points.slice(0, position-1),
										false,
										position,
										points[position-1].X,
										points[position-1].Y,
										points.slice(position, points.length),
										'',
										''
									);

			 // Focus sur la zone de saisie X
				document.getElementById("SaisieX").focus();
    	};


		// FONCTION - ajout ligne pour nouveau point interm�diaire
		$scope.addLine = function () {

			 // R�cup�ration donn�es double binding
			 	$scope.recuperation();

			 // Recherche point s�lectionn�
				$scope.selection();

			 // Ajustement liste points avant
				var points = pointsAvant.concat(pointsApres);
				pointsAvant = $scope.pointsAvant = points.slice(0, position-1);

			 // MAJ des positions des point apr�s la ligne ajout�e (+1) et d�selection
				pointsApres = $scope.pointsApres = points.slice(position-1, points.length+1);
			 	for (var point of pointsApres) {
					point.S = false;
					point.P = point.P + 1;
				}

			 // Affectation donn�es double binding
			 	$scope.affectation(
									pointsAvant,
									false,
									position,
									'',
									'',
									pointsApres,
									'',
									''
							      );

			 // Focus sur la zone de saisie X
				document.getElementById("SaisieX").focus();
		};


		// FONCTION - ajout ligne pour nouveau point interm�diaire
		$scope.simu = function () {

		 // R�cup�ration donn�es double binding
			$scope.recuperation();

		 // Fabrication tableau tous les points
			var points = pointsAvant.concat(pointsApres);

		 // Boucles somme des produits aux diff�rents points

		 // Boucle somme des produits pond�r�s par y(j) : Somme(j:1 => n) de y(j) x Produit(i:1=>n avec i!=j) de ( X - x(i) ) / ( x(j) - x(i) )
			var somme = 0;
			for (var j=0; j<points.length; j++)
			{
			 // Boucle Produit(i:1=>n avec i!=j) de ( X - x(i) ) / ( x(j) - x(i) )
				var produit = 1 ;
				for (var i=0; i<points.length; i++)
					{
					 // On �carte le cas de i = j pour le produit
						if (i != j)
						{
							var ratio = (simuX - points[i].X) / (points[j].X - points[i].X) ;
						 // Produit
							produit = produit * ratio ;
					}
				}

			 // Somme
				somme = somme + points[j].Y * produit;
			};

		 // Affectation donn�es double binding (r�sultat = somme totale)
			$scope.affectation(
								pointsAvant,
								pointCoursS,
								pointCoursP,
								pointCoursX,
								pointCoursY,
								pointsApres,
								simuX,
								somme
							   );

		 // Focus sur la zone de saisie X
			document.getElementById("SimuX").focus();
		}
	}
]);