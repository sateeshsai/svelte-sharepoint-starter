// // VIEW TRANSITIONS
// import { onNavigate } from '$app/navigation';

// export function enableViewTransitions() {
// 	onNavigate((navigation) => {
// 		if (!document.startViewTransition) return;

// 		return new Promise((resolve) => {
// 			document.startViewTransition(async () => {
// 				resolve();
// 				await navigation.complete;
// 			});
// 		});
// 	});
// }
