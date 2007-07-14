/* Copyright (c) 2007, Katharine Berry
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Katharine Berry nor the names of any contributors
 *       may be used to endorse or promote products derived from this software
 *       without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY KATHARINE BERRY ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL KATHARINE BERRY BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/

AjaxLife.Strings = {
	// Default English translations
	en: {
		Friends: {
			OnlineNotification: "#{name} is #{status}.",
			Online: "online",
			Offline: "offline"
		},
		InstantMessage: {
			Typing: "#{name} is typing...",
			OnlineFriends: "Online Friends",
			Send: "Send",
			WindowTitle: "Instant Messages"
		},
		AjaxLife: {
			Precaching: "Precaching...",
			MOTD: "Message of the Day"
		},
		Map: {
			TeleportConfirm: "Are you sure you want to teleport to #{sim} (#{x}, #{y})?",
			RegionLabel: "Region:",
			PositionLabel: "Position:",
			TeleportNoun: "Teleport",
			TeleportVerb: "Teleport",
			Teleporting: "Teleporting",
			FocusYou: "Focus on you",
			Clear: "Clear",
			FocusTarget: "Focus on target",
			HomeButton: "Go Home",
			HomeConfirm: "Are you sure you want to go home?",
			TeleportRequest: "#{name} has offered you a teleport:<br /><br />#{message}",
			TeleportRequestTitle: "Teleport offer",
			Teleportation: "Teleportation",
			TeleportSuccess: "You have successfully teleported to #{sim} (#{x}, #{y}, #{z})",
			TeleportCancelled: "Your teleport was cancelled.",
			TeleportError: "Your teleport was not successful. Please try again later.",
			WindowTitle: "Map",
			NoRegionGiven: "The server has failed to send the name of the sim you are in."
			
		},
		Network: {
			LoggingOut: "Logging out...",
			LogoutError: "Could not log out of Second Life due to a communication error.",
			LogoutSuccess: "You have logged out of Second Life.",
			LogoutForced: "You have been logged out of Second Life:<br /><br />#{reason}",
			UnhandledMessage: "Unhandled message",
			EventQueueFailure: "The event queue could not be updated.",
			GenericSendError: "An error occured while sending the data.",
			InventoryReceive: "#{name} gave you #{item}",
			Error: "Error",
			Disconnected: "Disconnected"
		},
		StatusBar: {
			Money: "Money",
			LindenDollarSymbol: "L$",
			Loading: " loading..."
		},
		SpatialChat: {
			ThirdPersonShout: " shouts:",
			SecondPersonShout: " shout:",
			ThirdPersonSay: ":",
			SecondPersonSay: ":",
			ThirdPersonWhisper: " whispers:",
			SecondPersonWhisper: " whisper:",
			You: "You",
			Say: "Say",
			Whisper: "Whisper",
			Shout: "Shout",
			WindowTitle: "Local chat"
		},
		Toolbar: {
			ChatButton: "Chat",
			ChatTooltip: "Talk to people near you",
			IMButton: "Instant Messages",
			IMTooltip: "Communicate with distant people",
			MapButton: "Map",
			MapTooltip: "Show the grid map",
			LogoutButton: "Log out",
			LogoutTitle: "Log out",
			LogoutPrompt: "Are you sure you want to log out?",
			LogoutTooltip: "Log out of Second Life"
		},
		Widgets: {
			Yes: "Yes",
			No: "No",
			Accept: "Accept",
			Decline: "Decline",
			OK: "OK",
			Cancel: "Cancel"
		}
	},
	es: {
		Friends: {
			OnlineNotification: "#{name} se ha #{status}.",
			Online: "conectado",
			Offline: "desconectado"
		},
		InstantMessage: {
			Typing: "#{name} está escribiendo...",
			OnlineFriends: "Amigos conectados",
			Send: "Enviar",
			WindowTitle: "Mensajes instantáneos"
		},
		AjaxLife: {
			Precaching: "Cargando...",
			MOTD: "Mensaje del día"
		},
		Map: {
			TeleportConfirm: "¿Estás seguro(a) de que quieres teletransportarte a #{sim} (#{x}, #{y})?",
			RegionLabel: "Región:",
			PositionLabel: "Posición:",
			TeleportNoun: "Teletransportación",
			TeleportVerb: "Teletransportar",
			Teleporting: "Teletransportando",
			FocusYou: "Mostrarte",
			Clear: "Limpiar",
			FocusTarget: "Mostrar destino",
			HomeButton: "Ir al inicio",
			HomeConfirm: "¿Estás seguro de querer ir al lugar de inicio?",
			TeleportRequest: "#{name} ha ofrecido teletransportarte a<br /><br />#{message}",
			TeleportRequestTitle: "Ofrecimiento de teletransportación",
			Teleportation: "Teletransportación",
			TeleportSuccess: "Te has teletransportado con éxito a #{sim} (#{x}, #{y}, #{z})",
			TeleportCancelled: "Tu teletransportación se ha cancelado.",
			TeleportError: "Tu teletransportación no fue exitosa. Por favor intenta más tarde.",
			WindowTitle: "Mapa"
			
		},
		Network: {
			LoggingOut: "Desconectando...",
			LogoutError: "No se pudo desconectar de Second Life debido a un error de comunicación.",
			LogoutSuccess: "Te has desconectado de Second Life.",
			LogoutForced: "Has sido desconectado(a) de Second Life:<br /><br />#{reason}",
			UnhandledMessage: "Mensaje no enviado",
			EventQueueFailure: "La cola de eventos no pudo ser actualizada.",
			GenericSendError: "Un error ocurrió durante la transferencia de datos.",
			InventoryReceive: "#{name} te dio #{item}",
			Error: "Error",
			Disconnected: "Desconectado"
		},
		StatusBar: {
			Money: "Dinero",
			LindenDollarSymbol: "L$",
			Loading: " cargando..."
		},
		SpatialChat: {
			ThirdPersonShout: "grita:",
			SecondPersonShout: " gritas:",
			ThirdPersonSay: ":",
			SecondPersonSay: ":",
			ThirdPersonWhisper: " susurra:",
			SecondPersonWhisper: " susurras:",
			You: "Tú",
			Say: "Decir",
			Whisper: "Susurrar",
			Shout: "Gritar",
			WindowTitle: "Chat local"
		},
		Toolbar: {
			ChatButton: "Chat",
			ChatTooltip: "Hablar con las personas cerca de ti",
			IMButton: "Mensajes instantáneos",
			IMTooltip: "Comunicar con las personas distantes",
			MapButton: "Mapa",
			MapTooltip: "Mostrar el mapa del mundo",
			LogoutButton: "Desconectarse",
			LogoutTitle: "Desconexión",
			LogoutPrompt: "¿Estás seguro de querer desconectarte?",
			LogoutTooltip: "Desconectarse de Second Life"
		},
		Widgets: {
			Yes: "Sí",
			No: "No",
			Accept: "Aceptar",
			Decline: "Declinar"
		}
	},
		 fr: {
		Friends: {
			OnlineNotification: "#{name} vient de se #{status}.",
			Online: "connecter",
			Offline: "déconnecter"
		},
		InstantMessage: {
			Typing: "#{name} est en train d'écrire...",
			OnlineFriends: "Amis en ligne",
			Send: "Envoyer",
			WindowTitle: "Messages instantanés"
		},
		AjaxLife: {
			Precaching: "En train de charger...",
			MOTD: "Message du jour"
		},
		Map: {
			TeleportConfirm: "Tu es sûr(e) de vouloir te téléporter à #{sim} (#{x}, #{y})?",
			RegionLabel: "Région:",
			PositionLabel: "Position:",
			TeleportNoun: "Téléportation",
			TeleportVerb: "Téléporter",
			Teleporting: "En train de téléporter...",
			FocusYou: "Ma position",
			Clear: "Effacer",
			FocusTarget: "Destination",
			HomeButton: "À l'origine",
			HomeConfirm: "Tu es sûr(e) de vouloir te téléporter à ton lieu d'origin?",
			TeleportRequest: "#{name} a proposé de téléporter à<br /><br />#{message}",
			TeleportRequestTitle: "Offre de téléportation",
			Teleportation: "Téléportation",
			TeleportSuccess: "Tu t'es téléporté avec de succès à #{sim} (#{x}, #{y}, #{z})",
			TeleportCancelled: "Ta téléportation a été annulée.",
			TeleportError: "Ta téleportation n'a pas eu de succès. S'il te plaît, essaie plus tard.",
			WindowTitle: "Carte"
			
		},
		Network: {
			LoggingOut: "En train de se déconnecter...",
			LogoutError: "Tu n'es pas déconnecté(e) de Second Life pour une erreur de communication.",
			LogoutSuccess: "Tu t'es déconnecté(e) de Second Life.",
			LogoutForced: "Tu as été déconnecté(e) de Second Life: <br /><br />#{reason}",
			UnhandledMessage: "Message pas envoyé",
			EventQueueFailure: "Le queue d'événements n'a pas pu être actualisé.",
			GenericSendError: "Une erreur s'est produite pendant le transfert de donnés",
			InventoryReceive: "#{name} t'a donné #{item}",
			Error: "Erreur",
			Disconnected: "Déconnecté(e)"
		},
		StatusBar: {
			Money: "Argent",
			LindenDollarSymbol: "L$",
			Loading: "En train de charger..."
		},
		SpatialChat: {
			ThirdPersonShout: "crie:",
			SecondPersonShout: " cries:",
			ThirdPersonSay: ":",
			SecondPersonSay: ":",
			ThirdPersonWhisper: " chuchote:",
			SecondPersonWhisper: " chuchotes:",
			You: "Tu",
			Say: "Dire",
			Whisper: "Chuchoter",
			Shout: "Crier",
			WindowTitle: "Tchatche local"
		},
		Toolbar: {
			ChatButton: "Tchatche",
			ChatTooltip: "Parler avec ceux qui se trouvent près de toi",
			IMButton: "Messages instantanés",
			IMTooltip: "Communiquer avec les personnes lointaines",
			MapButton: "Carte",
			MapTooltip: "Montrer la carte du monde",
			LogoutButton: "Se déconnecter",
			LogoutTitle: "Déconnection",
			LogoutPrompt: "Tu es sûr(e) de vouloir te déconnecter?",
			LogoutTooltip: "Se déconnecter de Second Life"
		},
		Widgets: {
			Yes: "Oui",
			No: "Non",
			Accept: "Accepter",
			Decline: "Décliner"
		}
	}
	// More translations here.
};

// Global usage functions.

function _(str, args)
{
	if(!args)
	{
		args = {};
	}
	for(var i in args)
	{
		if(typeof(args[i]) == "string")
		{
			args[i] = args[i].escapeHTML();
		}
		else if(typeof(args[i]) == "function" || typeof(args[i]) == "object")
		{
			args[i] = "";
		}
	}
	var parts = str.split('.');
	if(AjaxLife.Strings[gLanguageCode])
	{
		if(AjaxLife.Strings[gLanguageCode][parts[0]])
		{
			if(AjaxLife.Strings[gLanguageCode][parts[0]][parts[1]])
			{
				return(new Template(AjaxLife.Strings[gLanguageCode][parts[0]][parts[1]])).evaluate(args);
			}
		}
	}
	if(AjaxLife.Strings.en)
	{
		if(AjaxLife.Strings.en[parts[0]])
		{
			if(AjaxLife.Strings.en[parts[0]][parts[1]])
			{
				return(new Template(AjaxLife.Strings.en[parts[0]][parts[1]])).evaluate(args);
			}
		}
	}
	return str;
};