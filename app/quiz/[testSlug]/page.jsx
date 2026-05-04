'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

const LABELS = ['A', 'B', 'C', 'D'];

// ── Ontario G1 Road Signs — all 62 signs ─────────────────────
const SIGNS_QUESTIONS = [
  { id:1,  image:'/signs/stop.png',                    question:'What does this sign mean?', choices:['Yield to cross traffic','Come to a complete stop','Slow down and proceed','No entry'],                                      correct:1, explanation:'The red octagon STOP sign means you must come to a complete stop every time.' },
  { id:2,  image:'/signs/yield.png',                   question:'What does this sign mean?', choices:['Stop completely','Speed up to merge','Slow down and yield to traffic in the intersection','No U-turn'],                     correct:2, explanation:'The yield sign means slow down and give the right-of-way to traffic already in the intersection.' },
  { id:3,  image:'/signs/school_zone.png',             question:'What does this sign mean?', choices:['Hospital zone','Playground zone','School zone — watch for children crossing','Pedestrian crosswalk ahead'],                correct:2, explanation:'The pentagon-shaped school zone sign warns that children may be crossing. Slow to 40 km/h when children are present.' },
  { id:4,  image:'/signs/no_entry.png',                question:'What does this sign mean?', choices:['One-way street ahead','No straight through / Do not go straight','Road closed permanently','Construction zone ahead'],     correct:1, explanation:'This sign means you are not permitted to go straight through the intersection. You must turn left or right.' },
  { id:5,  image:'/signs/speed_limit_50.png',          question:'What does this sign mean?', choices:['Minimum speed is 50 km/h','Recommended speed for curve','Speed limit zone ends','Maximum speed is 50 km/h'],              correct:3, explanation:'Speed limit signs show the maximum legal speed under normal road and weather conditions.' },
  { id:6,  image:'/signs/pedestrian_crossing.png',     question:'What does this sign mean?', choices:['Bicycle crossing ahead','School crossing','Pedestrian crosswalk — watch for people crossing','Playground area'],            correct:2, explanation:'The pedestrian crosswalk sign warns you that people may be crossing the road ahead.' },
  { id:7,  image:'/signs/railway_crossing.png',        question:'What does this sign mean?', choices:['Road bump ahead','Railway crossing ahead — watch for trains','Bridge ahead','Construction zone'],                          correct:1, explanation:'The round railway crossing sign warns you that train tracks cross the road ahead. Always look both ways.' },
  { id:8,  image:'/signs/no_left_turn.png',            question:'What does this sign mean?', choices:['No right turn','No U-turn','No left turn permitted','One-way street'],                                                      correct:2, explanation:'The no left turn sign means you are prohibited from turning left at that intersection.' },
  { id:9,  image:'/signs/two_way_traffic.png',         question:'What does this sign mean?', choices:['Lane ends merge left','Divided highway ends','Two-way traffic ahead','Road narrows'],                                       correct:2, explanation:'This sign warns that you are leaving a divided highway and entering a two-way traffic road.' },
  { id:10, image:'/signs/keep_right.png',              question:'What does this sign mean?', choices:['Road closed','Keep right of the divider','Lane ends merge right','No passing zone'],                                        correct:1, explanation:'The keep right sign means you must stay to the right side of a traffic island or divider.' },
  { id:11, image:'/signs/no_right_turn.png',           question:'What does this sign mean?', choices:['Proceed right only','No right turn permitted','Road closed to the right','One way street'],                                correct:1, explanation:'The no right turn sign means you cannot turn right at that intersection.' },
  { id:12, image:'/signs/no_u_turn.png',               question:'What does this sign mean?', choices:['No left turn','No U-turn permitted at this location','Proceed straight only','One way traffic'],                           correct:1, explanation:'The no U-turn sign means you cannot make a U-turn at that location.' },
  { id:13, image:'/signs/one_way_right.png',           question:'What does this sign mean?', choices:['Two way traffic','Keep right','One way — traffic flows in the direction of the arrow only','Road narrows right'],           correct:2, explanation:'One way signs mean all traffic moves in the single direction shown by the arrow.' },
  { id:14, image:'/signs/wrong_way.png',               question:'What does this sign mean?', choices:['Road under construction','Do not enter — you are going the wrong way','One way street ahead','Detour ahead'],              correct:1, explanation:'Wrong way signs appear on exit ramps and one-way roads to warn drivers they are going in the wrong direction.' },
  { id:15, image:'/signs/speed_limit_100.png',         question:'What does this sign mean?', choices:['Minimum speed is 100 km/h','Recommended speed for highway','Maximum speed is 100 km/h','Speed zone ends'],                 correct:2, explanation:'100 km/h is the maximum speed on most Ontario highways unless posted otherwise.' },
  { id:16, image:'/signs/speed_limit_80.png',          question:'What does this sign mean?', choices:['Recommended curve speed','Maximum speed is 80 km/h','Minimum speed is 80 km/h','Speed limit ends'],                       correct:1, explanation:'80 km/h zones are common on rural roads and highways approaching towns.' },
  { id:17, image:'/signs/speed_limit_40.png',          question:'What does this sign mean?', choices:['Maximum speed is 40 km/h','Minimum speed is 40 km/h','School zone speed','Recommended speed'],                            correct:0, explanation:'40 km/h is the maximum speed in school zones when children are present.' },
  { id:18, image:'/signs/no_parking.png',              question:'What does this sign mean?', choices:['No stopping anytime','Parking prohibited in this area','No standing zone','Tow away zone'],                               correct:1, explanation:'The no parking sign means you cannot park your vehicle in that location.' },
  { id:19, image:'/signs/no_stopping.png',             question:'What does this sign mean?', choices:['No parking between posted hours','You must not stop your vehicle here at any time','Slow down ahead','No standing zone'],   correct:1, explanation:'No stopping means you cannot stop your vehicle at any time — stricter than no parking.' },
  { id:20, image:'/signs/curve_ahead.png',             question:'What does this sign mean?', choices:['Sharp right turn','Road ends','Curve ahead — slow down and be prepared','Detour right'],                                   correct:2, explanation:'The curve ahead sign warns of a bend in the road. Reduce speed before entering the curve.' },
  { id:21, image:'/signs/slippery_road.png',           question:'What does this sign mean?', choices:['Road under construction','Gravel road ahead','Road may be slippery when wet — reduce speed','Bumpy road ahead'],           correct:2, explanation:'The slippery road sign warns the road surface becomes dangerous when wet. Slow down.' },
  { id:22, image:'/signs/deer_crossing.png',           question:'What does this sign mean?', choices:['Farm animals crossing','Deer frequently cross this area — watch for wildlife','Forest area ahead','Hunting zone'],         correct:1, explanation:'The deer crossing sign warns that deer and other wildlife regularly cross the road in that area.' },
  { id:23, image:'/signs/construction.png',            question:'What does this sign mean?', choices:['Hospital ahead','Workers and equipment on or near the road — slow down','Road closed permanently','Detour begins'],        correct:1, explanation:'Construction signs warn of road work ahead. Fines double in construction zones when workers are present.' },
  { id:24, image:'/signs/merge_right.png',             question:'What does this sign mean?', choices:['Keep left','Road narrows — merge with traffic on the right','Lane closed ahead','Passing lane ends'],                     correct:1, explanation:'The merge right sign means your lane is ending and you must safely merge into traffic on your right.' },
  { id:25, image:'/signs/road_narrows.png',            question:'What does this sign mean?', choices:['Bridge ahead','Road construction begins','The road ahead becomes narrower — stay centred','Lane ends merge left'],          correct:2, explanation:'Road narrows signs warn that the pavement width decreases ahead. Slow down and stay alert.' },
  { id:26, image:'/signs/divided_highway.png',         question:'What does this sign mean?', choices:['Two-way traffic begins','Divided highway ends — two-way traffic ahead','Highway entrance','Median ends'],                 correct:1, explanation:'This sign warns that the divided highway is ending and you are entering a two-way road.' },
  { id:27, image:'/signs/sharp_turn.png',              question:'What does this sign mean?', choices:['Gentle curve ahead','Winding road ahead','Very sharp turn ahead — slow down significantly','Road ends'],                  correct:2, explanation:'A sharp turn sign indicates a severe bend. Slow down well before the sign.' },
  { id:28, image:'/signs/traffic_light_ahead.png',     question:'What does this sign mean?', choices:['Intersection ahead','Traffic lights control the intersection ahead','Railway crossing ahead','School crossing ahead'],     correct:1, explanation:'This sign warns that traffic lights are ahead — especially useful when the intersection is not visible.' },
  { id:29, image:'/signs/bikes_only.png',              question:'What does this sign mean?', choices:['No bicycles allowed','Shared road with bikes','This lane is reserved for bicycles only','Bicycle crossing ahead'],         correct:2, explanation:'The bicycle lane sign means that lane is reserved exclusively for cyclists. Do not drive or park in it.' },
  { id:30, image:'/signs/hill_ahead.png',              question:'What does this sign mean?', choices:['Speed bump ahead','Steep hill ahead — check brakes and control speed','Road ends at water','Rough road ahead'],          correct:1, explanation:'The steep hill sign warns of a significant downgrade. Trucks must use lower gears. All drivers should slow down.' },
  { id:31, image:'/signs/do_not_pass.png',             question:'What does this sign mean?', choices:['Pass only when safe','No passing on this road','Passing lane ahead','Slow vehicles must pass here'],                      correct:1, explanation:'The no passing sign means you are not allowed to pass other vehicles on this road.' },
  { id:32, image:'/signs/no_pedestrians.png',          question:'What does this sign mean?', choices:['Pedestrian crossing ahead','Watch for pedestrians','No pedestrians allowed on this road','Pedestrian zone begins'],        correct:2, explanation:'This sign prohibits pedestrians from using this road or area.' },
  { id:33, image:'/signs/no_bicycles.png',             question:'What does this sign mean?', choices:['Bicycle lane ahead','Bicycle crossing ahead','No bicycles allowed on this road','Bicycles must dismount'],                correct:2, explanation:'This sign prohibits cyclists from using this road.' },
  { id:34, image:'/signs/accessible_parking.png',      question:'What does this sign mean?', choices:['Hospital parking only','Reserved for emergency vehicles','This space is only for vehicles with a valid Accessible Parking Permit','Loading zone'], correct:2, explanation:'Only vehicles displaying a valid Accessible Parking Permit may use this space.' },
  { id:35, image:'/signs/slow_traffic_keep_right.png', question:'What does this sign mean?', choices:['All traffic must keep right','Slow traffic on multi-lane roads must keep right','Right lane closed ahead','Lane ends merge left'], correct:1, explanation:'Slow-moving vehicles must use the right lane on multi-lane roads.' },
  { id:36, image:'/signs/hov_lane.png',                question:'What does this sign mean?', choices:['Any vehicle may use this lane','This lane is only for buses','Only vehicles with 2 or more occupants may use this lane','HOV lane ends ahead'], correct:2, explanation:'High Occupancy Vehicle lanes are reserved for vehicles with the minimum number of passengers shown.' },
  { id:37, image:'/signs/one_way_left.png',            question:'What does this sign mean?', choices:['Two-way traffic','Keep left','One way — traffic flows to the left only','Road narrows left'],                             correct:2, explanation:'One way signs mean all traffic moves in the single direction shown by the arrow.' },
  { id:38, image:'/signs/keep_right_divide.png',       question:'What does this sign mean?', choices:['Stay in current lane','Keep to the right side of the traffic island or divider','Lane closed on right','No right turns'],correct:1, explanation:'The keep right sign tells drivers to pass to the right of a traffic island or obstruction.' },
  { id:39, image:'/signs/speed_limit_ahead.png',       question:'What does this sign mean?', choices:['Speed limit ends here','Speed limit zone begins','Speed limit changes ahead — be prepared','Reduced speed zone'],         correct:2, explanation:'This sign warns you that the posted speed limit is about to change. Prepare to adjust your speed.' },
  { id:40, image:'/signs/do_not_enter.png',            question:'What does this sign mean?', choices:['One-way street ahead','Do not enter this road from your direction','Road closed for construction','Yield to oncoming traffic'], correct:1, explanation:'The do not enter sign means you cannot enter this road from your direction.' },
  { id:41, image:'/signs/winding_road.png',            question:'What does this sign mean?', choices:['One curve ahead','Sharp turn ahead','Road has several curves ahead — drive carefully','Detour ahead'],                    correct:2, explanation:'A winding road sign warns that the road has a series of curves ahead. Reduce speed and drive carefully.' },
  { id:42, image:'/signs/hidden_school_bus.png',       question:'What does this sign mean?', choices:['School zone ahead','You are approaching a hidden school bus stop — slow down and watch for children','School bus parking area','No school buses'], correct:1, explanation:'This sign warns of a hidden school bus stop where the bus may not be visible. Slow down.' },
  { id:43, image:'/signs/bicycle_crossing.png',        question:'What does this sign mean?', choices:['Bicycle lane begins','Cyclists must stop here','Bicycles crossing the road ahead — watch for cyclists','Bicycle route ends'], correct:2, explanation:'This warning sign tells drivers that cyclists may be crossing the road ahead.' },
  { id:44, image:'/signs/slippery_when_wet.png',       question:'What does this sign mean?', choices:['Road under construction','Gravel surface ahead','Pavement is slippery when wet — slow down','Road floods in rain'],       correct:2, explanation:'This sign warns that the road surface becomes dangerous when wet. Reduce speed in wet conditions.' },
  { id:45, image:'/signs/stop_ahead.png',              question:'What does this sign mean?', choices:['Yield sign ahead','Traffic lights ahead','Slow down — a stop sign is ahead','Road closed ahead'],                        correct:2, explanation:'This warning sign tells you a stop sign is coming up. Begin slowing down now.' },
  { id:46, image:'/signs/divided_highway_begins.png',  question:'What does this sign mean?', choices:['Divided highway begins ahead — keep right','Road narrows ahead','Highway entrance ramp','Passing lane begins'],            correct:0, explanation:'This sign warns that a divided highway with a median is beginning. Keep to the right-hand road.' },
  { id:47, image:'/signs/right_lane_ends.png',         question:'What does this sign mean?', choices:['Keep right','Right lane ends ahead — merge left safely','Road narrows on right','Exit ramp ahead on right'],              correct:1, explanation:'This sign warns that the right lane is ending. Drivers in the right lane must safely merge left.' },
  { id:48, image:'/signs/roundabout_ahead.png',        question:'What does this sign mean?', choices:['Traffic circle closed ahead','Reduce speed — roundabout ahead — traffic flows counter-clockwise','Yield sign ahead','U-turn permitted here'], correct:1, explanation:'This sign warns that a roundabout is ahead. Reduce speed and yield to traffic already in the roundabout.' },
  { id:49, image:'/signs/narrow_bridge.png',           question:'What does this sign mean?', choices:['Low bridge ahead','Weight limit on bridge ahead','Narrow bridge ahead — may not accommodate two vehicles side by side','Bridge under construction'], correct:2, explanation:'This sign warns that the bridge ahead is narrower than the road. Use caution.' },
  { id:50, image:'/signs/share_road.png',              question:'What does this sign mean?', choices:['Bicycle lane begins','Cyclists must use the sidewalk','Road is shared — provide safe space for cyclists','No vehicles allowed'], correct:2, explanation:'This sign warns that cyclists and vehicles share the road ahead. Give cyclists safe space.' },
  { id:51, image:'/signs/road_work_ahead.png',         question:'What does this sign mean?', choices:['Road closed permanently','Slow down — road work zone ahead','Detour begins here','Construction completed'],               correct:1, explanation:'This orange sign warns of road work ahead. Slow down and watch for workers and equipment.' },
  { id:52, image:'/signs/construction_zone.png',       question:'What does this sign mean?', choices:['Road closed — find alternate route','You are entering a construction zone — drive with extra caution','Construction zone ends','Workers not present'], correct:1, explanation:'Orange construction zone signs warn you to reduce speed and drive carefully. Fines are doubled when workers are present.' },
  { id:53, image:'/signs/detour.png',                  question:'What does this sign mean?', choices:['Road work complete — resume normal route','Temporary detour from normal traffic route','No through traffic','Road closed ahead'], correct:1, explanation:'Orange detour signs guide you around a road closure. Follow them until you return to your normal route.' },
  { id:54, image:'/signs/lane_closed.png',             question:'What does this sign mean?', choices:['Pass the closed lane quickly','Merge with traffic in the open lane — lane ahead is closed for roadwork','Road closed — turn around','Keep in current lane'], correct:1, explanation:'This sign warns that a lane is closed ahead due to road work. Safely merge into the open lane.' },
  { id:55, image:'/signs/flagger_ahead.png',           question:'What does this sign mean?', choices:['Traffic lights ahead','Speed up to clear the construction zone','Traffic control person ahead — drive slowly and follow instructions','Construction zone ends'], correct:2, explanation:'This sign warns that a person is controlling traffic ahead. Slow down and follow all directions.' },
  { id:56, image:'/signs/construction_1km_ahead.png',  question:'What does this sign mean?', choices:['Road closed 1 km ahead','Road work begins in 1 kilometre — reduce speed and prepare','Detour in 1 km','Speed limit reduces to 1 km/h'], correct:1, explanation:'This orange sign warns that a construction zone begins 1 kilometre ahead. Slow down and be prepared.' },
  { id:57, image:'/signs/no_right_on_red.png',         question:'What does this sign mean?', choices:['No right turn at any time','No right turn permitted when facing a red light at this intersection','Right turn on red permitted with caution','Stop before turning right on red'], correct:1, explanation:'This sign prohibits right turns when the traffic light is red at that specific intersection.' },
  { id:58, image:'/signs/no_stopping_zone.png',        question:'What does this sign mean?', choices:['No parking between the signs','No standing — passengers may exit only','You must not stop your vehicle even for a moment between these signs','Tow away zone during rush hour'], correct:2, explanation:'No stopping means you cannot stop your vehicle at any time in this area — not even for a moment.' },
  { id:59, image:'/signs/community_safety_zone.png',   question:'What does this sign mean?', choices:['School zone with reduced speed','Hospital area — drive with caution','Special community zone where traffic fines are increased for violations','Construction workers present'], correct:2, explanation:'Community Safety Zones identify areas with special risk to pedestrians. Traffic fines are increased for violations.' },
  { id:60, image:'/signs/snowmobiles_permitted.png',   question:'What does this sign mean?', choices:['No snowmobiles allowed on this road','Snowmobile crossing ahead','Snowmobiles may use this road','Winter road conditions ahead'], correct:2, explanation:'This regulatory sign indicates that snowmobiles are permitted to use this road.' },
  { id:61, image:'/signs/parking_permitted.png',       question:'What does this sign mean?', choices:['No parking at any time','Parking is prohibited except for permit holders','You may park in this area between the signs during the posted times','Free parking zone'], correct:2, explanation:'This sign indicates that parking is permitted in the area between paired signs during the hours shown.' },
  { id:62, image:'/signs/flashing_arrow.png',          question:'What does this sign mean?', choices:['Lane closed ahead — merge now','Road work zone begins','Flashing lights on arrows show the direction traffic must follow','Emergency vehicle approaching'], correct:2, explanation:'Flashing arrow boards in construction zones direct traffic to move in the indicated direction. Always follow the arrows.' },
];

// ── Ontario M1 Motorcycle — 60 questions ─────────────────────
const M1_QUESTIONS = [
  { id:1,  question:'What is the minimum age to apply for an M1 motorcycle licence in Ontario?', choices:['14 years old','16 years old','18 years old','17 years old'], correct:1, explanation:'You must be at least 16 years old to apply for an M1 motorcycle licence in Ontario.' },
  { id:2,  question:'How long is an M1 licence valid in Ontario?', choices:['30 days','60 days','90 days','6 months'], correct:2, explanation:'An M1 licence is valid for 90 days. After that you must take the M2 exit test or reapply.' },
  { id:3,  question:'What must an M1 rider NOT do?', choices:['Ride on roads with a speed limit of 80 km/h or less','Carry passengers or ride on expressways','Ride during the day','Wear a helmet'], correct:1, explanation:'M1 riders cannot carry passengers, ride on 400-series highways, or ride between midnight and 5 a.m.' },
  { id:4,  question:'An M1 rider must have a blood alcohol level of:', choices:['0.05% or less','0.08% or less','0.00% — zero tolerance','0.03% or less'], correct:2, explanation:'M1 and M2 riders must have zero blood alcohol. Any alcohol in the blood is a violation.' },
  { id:5,  question:'To upgrade from M2 to full M licence, how long must you hold the M2?', choices:['6 months','12 months','18 months','22 months'], correct:3, explanation:'You must hold an M2 for at least 22 months (18 months with an approved safety course) before taking the M exit test.' },
  { id:6,  question:'Is wearing a helmet legally required for motorcycle riders in Ontario?', choices:['Only on highways','Yes — riders and passengers must always wear an approved helmet','Only for riders under 18','No — it is recommended but not required'], correct:1, explanation:'Ontario law requires all motorcycle riders and passengers to wear a helmet that meets approved safety standards.' },
  { id:7,  question:'What type of helmet provides the most protection?', choices:['Half helmet (brain bucket)','Three-quarter helmet','Full-face helmet','Open-face helmet'], correct:2, explanation:'A full-face helmet provides the most protection — it covers the entire head including the chin and face.' },
  { id:8,  question:'Which of the following is the best protective jacket for motorcycle riding?', choices:['A light cotton jacket','A leather or reinforced synthetic jacket with padding','A rain jacket','Any jacket that keeps you warm'], correct:1, explanation:'A leather or reinforced synthetic jacket with built-in padding provides the best abrasion and impact protection.' },
  { id:9,  question:'Why should motorcycle riders wear brightly coloured or reflective clothing?', choices:['It is required by Ontario law','To stay cooler in summer','To be more visible to other drivers','To identify themselves as motorcyclists'], correct:2, explanation:'Bright and reflective clothing makes you more visible to other drivers, especially in low-light conditions.' },
  { id:10, question:'Motorcycle boots should ideally:', choices:['Be lightweight running shoes for better feel','Cover the ankle and have a low heel and oil-resistant sole','Be sandals for better airflow in summer','Have a high heel for better grip on pegs'], correct:1, explanation:'Proper motorcycle boots should cover the ankle, have a sturdy low heel to prevent slipping off the pegs, and an oil-resistant sole.' },
  { id:11, question:'What is T-CLOCS used for in motorcycle riding?', choices:['A type of motorcycle brake system','A pre-ride safety inspection checklist','A technique for cornering','A type of helmet standard'], correct:1, explanation:'T-CLOCS stands for Tires, Controls, Lights, Oil, Chassis, and Stands — a pre-ride inspection checklist.' },
  { id:12, question:'What tire pressure should a motorcycle have before riding?', choices:['The same as a car tire','As high as possible for speed','The pressure recommended by the manufacturer','Any pressure as long as the tire is not flat'], correct:2, explanation:'Always inflate tires to the manufacturer\'s recommended pressure. Under or over-inflation affects handling and safety.' },
  { id:13, question:'Before riding, you should check your motorcycle\'s:', choices:['Tire pressure only','Engine oil, tires, lights, brakes, mirrors, and controls','Fuel level only','Seat comfort only'], correct:1, explanation:'A complete pre-ride inspection includes tires, controls, lights, oil level, chassis, and stands — never skip it.' },
  { id:14, question:'How should you check if your motorcycle brakes are working properly?', choices:['Squeeze hard and see if the wheel locks','Apply each brake separately to ensure they engage and the bike slows','Only test them at high speed','Check by feeling the brake fluid level'], correct:1, explanation:'Test each brake separately at low speed before riding. The motorcycle should slow and stop smoothly.' },
  { id:15, question:'When should you use both the front and rear brakes?', choices:['Only the rear brake — the front is for emergencies','Only the front brake — it is more effective','Both brakes together for maximum stopping power','Alternate between front and rear'], correct:2, explanation:'Using both front and rear brakes together provides the maximum stopping power. The front brake provides about 70% of stopping ability.' },
  { id:16, question:'What is the correct body position for motorcycle riding?', choices:['Lean far forward with arms straight','Sit upright with knees gripping the tank and feet on the pegs','Lean back as far as possible','Cross your arms for balance'], correct:1, explanation:'Sit upright or with a slight lean forward. Grip the tank with your knees, keep feet on the pegs, and keep elbows slightly bent.' },
  { id:17, question:'When turning a motorcycle, you should:', choices:['Lean the motorcycle while keeping your body upright','Keep the motorcycle upright and turn only the handlebars','Lean both the motorcycle and your body into the turn','Apply the rear brake before entering the turn'], correct:2, explanation:'For normal turns, lean both the motorcycle and your body into the turn together.' },
  { id:18, question:'What is countersteering on a motorcycle?', choices:['Turning the handlebars in the opposite direction of the turn to initiate leaning','Braking with both hands','Steering with only one hand','Turning the wheel into a skid'], correct:0, explanation:'Countersteering means pushing the handlebar on the side you want to turn. Pushing left bar → bike goes left. This initiates the lean at speeds above 20 km/h.' },
  { id:19, question:'What should you do if your throttle sticks while riding?', choices:['Brake hard immediately','Try to roll the throttle closed, pull in the clutch, then apply brakes and pull over','Jump off the motorcycle','Turn off the engine immediately while still moving'], correct:1, explanation:'Try to roll the throttle closed. If it remains stuck, pull in the clutch to cut power, apply brakes gradually, and pull over safely.' },
  { id:20, question:'What does it mean when the rear wheel of your motorcycle starts to skid?', choices:['You need to accelerate out of it','The rear brake is being over-applied — ease off the brake and steer straight','The front brake is failing','The tire is flat'], correct:1, explanation:'A rear wheel skid is caused by over-braking the rear. Ease off the rear brake gradually, steer straight, and avoid locking the wheel.' },
  { id:21, question:'A motorcycle lane has three positions: left, centre, and right. Which is generally the best?', choices:['Always the centre','Always the left','The position that makes you most visible and keeps you away from hazards','Always the right'], correct:2, explanation:'The best lane position changes with conditions. Choose the position that maximizes your visibility and distance from hazards.' },
  { id:22, question:'Why should motorcyclists avoid riding in the centre of a lane?', choices:['It is illegal','It is where oil, grease and debris collect from car drippings','It has less traction','It confuses other drivers'], correct:1, explanation:'The centre of a lane collects oil drips and road debris from vehicles. The wheel tracks are generally cleaner.' },
  { id:23, question:'When riding in a group, motorcyclists should use:', choices:['Single file formation at all times','A staggered formation with adequate space between riders','Side-by-side formation','No specific formation is required'], correct:1, explanation:'A staggered formation allows each rider adequate space while keeping the group compact. Switch to single file on curves.' },
  { id:24, question:'What is a blind spot in motorcycling?', choices:['An area of road you cannot see ahead','An area beside or behind your motorcycle not visible in mirrors — always check by looking over your shoulder','A spot on your visor that blocks vision','The area directly below the front wheel'], correct:1, explanation:'Blind spots are areas not visible in your mirrors. Always turn your head and look over your shoulder before changing lanes.' },
  { id:25, question:'When approaching an intersection, you should position your motorcycle:', choices:['In the centre of the lane','In the position that makes you most visible to cross traffic and other road users','As far right as possible','As close to the centre line as possible'], correct:1, explanation:'At intersections, choose the position that maximizes your visibility.' },
  { id:26, question:'Which road surface is most slippery for motorcycles?', choices:['Dry asphalt','Wet leaves, paint, or steel plates on the road','Gravel roads','Rough pavement'], correct:1, explanation:'Wet leaves, painted road markings, steel plates, and manhole covers become extremely slippery when wet. Treat them like ice.' },
  { id:27, question:'When crossing railway tracks on a motorcycle, you should:', choices:['Cross as quickly as possible','Cross at a 45-degree angle to minimize the risk of wheels catching in the tracks','Cross at a 90-degree angle (perpendicular to the tracks)','Slow to a stop then cross'], correct:2, explanation:'Cross railway tracks at a 90-degree angle (straight across). This prevents your tires from catching in the track groove.' },
  { id:28, question:'What should you do when riding through sand or gravel on the road?', choices:['Brake hard immediately','Accelerate through it quickly','Slow down before reaching it, then ride through smoothly without sudden inputs','Lean the motorcycle sharply to avoid it'], correct:2, explanation:'Reduce speed before reaching the hazard. Ride through slowly and smoothly — avoid sudden braking, acceleration, or steering changes.' },
  { id:29, question:'On a windy day, a motorcyclist should:', choices:['Lean into the wind and adjust lane position accordingly','Hold the handlebars loosely','Speed up to minimize wind effect','Ride in the centre of the lane at all times'], correct:0, explanation:'Lean slightly into the wind and adjust your lane position to allow for gusts, especially when passing large vehicles or open areas.' },
  { id:30, question:'What is the greatest danger when riding behind a large truck?', choices:['The truck\'s brakes are less effective','Large blind spots and reduced visibility ahead — you cannot see hazards','Trucks accelerate too fast','Trucks change lanes without signalling'], correct:1, explanation:'Large trucks have extensive blind spots and block your view of the road ahead. Increase your following distance.' },
  { id:31, question:'Why is SEE (Search, Evaluate, Execute) important for motorcyclists?', choices:['It is a braking technique','It is a strategy to continuously scan for and respond to hazards before they become emergencies','It refers to lane positioning','It is a government regulation'], correct:1, explanation:'SEE is a hazard awareness strategy: Search the road ahead, Evaluate hazards, then Execute the best response.' },
  { id:32, question:'To make yourself more visible to other drivers, you should:', choices:['Ride only on back roads','Use your high-beam headlight during the day, wear bright gear, and avoid blind spots','Ride as fast as possible to reduce time in dangerous areas','Stay in the centre of the lane at all times'], correct:1, explanation:'Daytime headlight use, bright/reflective gear, and avoiding other drivers\' blind spots all significantly improve your visibility.' },
  { id:33, question:'What is the most dangerous location for motorcycle crashes?', choices:['Early morning on highways','At intersections during daylight hours','On rural roads at night','During rain'], correct:1, explanation:'Most motorcycle crashes involving another vehicle occur at intersections, often because a driver failed to see the motorcycle.' },
  { id:34, question:'When a car is about to turn left in front of you, you should:', choices:['Speed up to get past before the car turns','Sound your horn and maintain speed','Cover the brakes, reduce speed, be prepared to stop or swerve','Move to the right lane'], correct:2, explanation:'A left-turning car is one of the most common causes of motorcycle crashes. Always cover your brakes and be ready to stop or take evasive action.' },
  { id:35, question:'When should you use your horn on a motorcycle?', choices:['Never — it is too small to hear','To alert other road users to your presence when there is a potential hazard','Only when someone cuts you off','As a greeting to other motorcyclists'], correct:1, explanation:'Use your horn to alert drivers who may not see you — for example, a car drifting into your lane or about to pull out in front of you.' },
  { id:36, question:'When riding at night, you should:', choices:['Use your high beams at all times','Increase your following distance and reduce speed to match your headlight range','Ride faster to reduce time spent in darkness','Wear dark clothing to look cool'], correct:1, explanation:'At night, increase following distance and reduce speed so you can stop within the distance illuminated by your headlight.' },
  { id:37, question:'What should you do when an oncoming vehicle\'s high beams blind you?', choices:['Flash your high beams repeatedly','Look toward the right edge of the road and slow down','Close your eyes briefly','Swerve to the right'], correct:1, explanation:'Look toward the right edge of the road to avoid the glare. Slow down and do not look directly at the oncoming headlights.' },
  { id:38, question:'What is the correct technique for emergency braking on a motorcycle?', choices:['Apply only the rear brake hard','Apply only the front brake hard','Apply both brakes progressively and firmly without locking the wheels','Engine brake by downshifting rapidly'], correct:2, explanation:'Apply both brakes progressively — squeeze the front brake firmly and press the rear brake. Avoid locking wheels as this causes skidding.' },
  { id:39, question:'If you need to swerve to avoid a hazard, you should:', choices:['Apply both brakes first, then swerve','Swerve while braking hard','Swerve first using countersteering, then brake after the swerve is complete','Only swerve — never brake'], correct:2, explanation:'Swerve and brake separately. Braking during a swerve can cause a skid. Complete the swerve, straighten up, then brake.' },
  { id:40, question:'What should you do if a dog or animal runs in front of your motorcycle?', choices:['Swerve sharply to avoid it','Brake hard and stop completely','Brake progressively, hold course if possible, and sound the horn','Speed up to avoid it'], correct:2, explanation:'Brake firmly but progressively. Swerving sharply may be more dangerous than hitting a small animal. Sound the horn to scare it away.' },
  { id:41, question:'When can an M1 rider carry a passenger?', choices:['Any time — if the passenger wears a helmet','Never — M1 riders are not permitted to carry passengers','Only on roads with speed limits under 60 km/h','Only with a licensed rider following'], correct:1, explanation:'M1 riders are prohibited from carrying passengers. Passengers are only allowed once you have an M2 or full M licence.' },
  { id:42, question:'How does carrying a passenger affect your motorcycle?', choices:['No effect if the passenger sits still','It increases weight, affects braking distance, and changes handling — increase following distance','It makes the motorcycle more stable','Only affects acceleration'], correct:1, explanation:'Passengers add weight which increases braking distance and affects handling. Increase following distance and adjust tire pressure if needed.' },
  { id:43, question:'How should cargo be loaded on a motorcycle?', choices:['Hang it from the handlebars for easy access','Loaded low and evenly distributed on both sides to keep the centre of gravity low','Stacked as high as possible on the back','Weight does not matter as long as it is tied down'], correct:1, explanation:'Load cargo low and balanced on both sides. High or uneven loads raise the centre of gravity and make the motorcycle unstable.' },
  { id:44, question:'Can two motorcycles ride side-by-side in the same lane in Ontario?', choices:['Yes, always','Yes, but only on highways','No — each motorcycle must occupy its own lane','Yes, but only if both riders agree'], correct:2, explanation:'In Ontario, each motorcycle must occupy its own lane. Lane sharing (two motorcycles side-by-side in one lane) is illegal.' },
  { id:45, question:'Can a motorcycle lane-split (ride between lanes of slow or stopped traffic) in Ontario?', choices:['Yes, if traffic is stopped','Yes, if moving slower than 20 km/h','No — lane-splitting is illegal in Ontario','Yes, but only on highways'], correct:2, explanation:'Lane-splitting (riding between lanes of traffic) is illegal in Ontario. Each vehicle must stay within its lane.' },
  { id:46, question:'What following distance should a motorcyclist maintain behind another vehicle?', choices:['1 second','2 seconds minimum — more in poor conditions','5 car lengths','Same as any vehicle — 1 car length per 10 km/h'], correct:1, explanation:'Maintain at least a 2-second following distance. Increase to 3-4 seconds in bad weather, heavy traffic, or at night.' },
  { id:47, question:'When can a motorcyclist use the paved shoulder to pass on the right?', choices:['When traffic is slow','Never — the paved shoulder is not a travel lane and passing on the shoulder is illegal','When a vehicle is turning left','On multi-lane highways only'], correct:1, explanation:'The paved shoulder is not a travel lane. Passing on the shoulder is illegal and dangerous due to debris and unstable surfaces.' },
  { id:48, question:'At what speed should you ride through a curve?', choices:['At the posted speed limit','At a speed that allows you to stop within your sight distance and maintain control through the curve','As fast as possible to lean through it efficiently','At 20 km/h below the posted limit'], correct:1, explanation:'Slow before the curve, not during it. Enter at a speed you can maintain control through the entire curve and stop if needed.' },
  { id:49, question:'How does rain affect motorcycle riding?', choices:['No effect if tires are new','Reduces traction and visibility — increase following distance and reduce speed','Only affects the first few minutes','Makes braking more effective'], correct:1, explanation:'Rain reduces traction on all surfaces, especially at the start of a rain shower when oil rises to the surface. Slow down and increase following distance.' },
  { id:50, question:'What is the most dangerous time on a road at the start of rain?', choices:['After 30 minutes of rain when roads are flooded','The first few minutes of rain when water mixes with road oil creating a slippery film','During heavy downpours only','Only when there is thunder'], correct:1, explanation:'The first 15-30 minutes of rain are the most dangerous. Water mixes with oil and rubber deposits making the road surface extremely slippery.' },
  { id:51, question:'When should you NOT ride a motorcycle?', choices:['When it is windy','When you are tired, impaired, or taking medications that affect alertness','When the temperature is below 10°C','On Sundays'], correct:1, explanation:'Never ride when tired, impaired by alcohol/drugs, or taking medications that affect alertness or reaction time.' },
  { id:52, question:'What should you do if your motorcycle begins to wobble at highway speed?', choices:['Brake hard immediately','Grip the handlebars tightly and accelerate out of it','Ease off the throttle slowly, grip the tank with your knees, and let the motorcycle slow naturally','Swerve left and right to correct the wobble'], correct:2, explanation:'Do not brake suddenly or accelerate. Grip the tank with your knees for stability, ease off the throttle, and let the bike slow naturally.' },
  { id:53, question:'How does alcohol affect motorcycle riding ability?', choices:['It improves confidence and balance','It impairs balance, reaction time, and judgment — far more dangerous on a motorcycle than in a car','It only affects night riding','It has less effect on motorcyclists than car drivers'], correct:1, explanation:'Alcohol impairs the balance, coordination, and judgment that motorcycling demands. The effects are far more dangerous on a motorcycle.' },
  { id:54, question:'Is it legal to use a handheld phone while riding a motorcycle in Ontario?', choices:['Yes, if stopped at a red light','Yes, if using speakerphone','No — handheld device use is prohibited while operating any motor vehicle','Yes, at speeds under 20 km/h'], correct:2, explanation:'Using a handheld device while operating any motor vehicle — including a motorcycle — is prohibited in Ontario.' },
  { id:55, question:'How often should you check your motorcycle\'s tire pressure?', choices:['Once a month','Before every ride — tires can lose pressure daily','Only when a tire looks flat','Once a week'], correct:1, explanation:'Check tire pressure before every ride. Tires can lose pressure gradually and the difference is not always visible.' },
  { id:56, question:'What is the minimum legal tread depth for motorcycle tires in Ontario?', choices:['0.5 mm','1.0 mm','1.5 mm','2.0 mm'], correct:1, explanation:'Motorcycle tires must have a minimum tread depth of 1.0 mm to be legal. Worn tires significantly reduce wet-weather traction.' },
  { id:57, question:'Why is the chain on a motorcycle important to maintain?', choices:['It affects the colour of the motorcycle','A loose, dry, or worn chain can break or slip, causing sudden loss of power or wheel lock-up','It is only important for racing','Chain maintenance is optional on modern motorcycles'], correct:1, explanation:'A poorly maintained chain can snap or jam the rear wheel, causing a crash. Check tension, lubrication, and wear regularly.' },
  { id:58, question:'When passing a parked car, a motorcyclist should:', choices:['Ride as close as possible to save space','Watch for doors opening and leave at least 1 metre of clearance','Honk before passing','Accelerate quickly past the car'], correct:1, explanation:'A suddenly opened car door can be fatal to a motorcyclist. Always leave at least 1 metre of clearance when passing parked vehicles.' },
  { id:59, question:'What is the greatest risk when a large truck passes you on the highway?', choices:['Dust and debris thrown up by the truck','Wind turbulence that can push your motorcycle sideways','The truck blocking your vision','Noise from the truck'], correct:1, explanation:'Large trucks create significant wind turbulence. Be prepared for sudden buffeting as the truck passes — hold the handlebars firmly.' },
  { id:60, question:'What should you do when you see a pothole or road hazard ahead?', choices:['Brake hard and stop immediately','Slow down, check mirrors, and if safe, move around it — if unavoidable, rise slightly off the seat and slow before impact','Accelerate to jump over it','Swerve sharply without checking mirrors'], correct:1, explanation:'If you cannot avoid a hazard, slow down, rise slightly off the seat to absorb the impact with your legs, and pass through at reduced speed.' },
];

const AZ_QUESTIONS = [
 
  // ── LICENSING ─────────────────────────────────────────────
  {
    id: 1,
    question: 'What class of licence do you need to drive a semi-trailer truck (tractor-trailer) in Ontario?',
    choices: ['Class D', 'Class B', 'Class A', 'Class C'],
    correct: 2,
    explanation: 'A Class A licence allows you to drive any motor vehicle or combination of vehicles. This is the AZ licence required for tractor-trailers.',
  },
  {
    id: 2,
    question: 'What is the minimum age to apply for a Class A (AZ) licence in Ontario?',
    choices: ['16 years old', '18 years old', '21 years old', '17 years old'],
    correct: 1,
    explanation: 'You must be at least 18 years old to apply for a Class A (AZ) licence in Ontario.',
  },
  {
    id: 3,
    question: 'What does the "Z" endorsement on a Class A licence allow you to operate?',
    choices: ['Vehicles with air brakes', 'Vehicles over 11,000 kg', 'Vehicles with more than 3 axles', 'School buses'],
    correct: 0,
    explanation: 'The "Z" endorsement allows you to operate vehicles equipped with air brakes. Without it, you cannot drive air-braked vehicles.',
  },
  {
    id: 4,
    question: 'What document must a commercial truck driver carry at all times while driving?',
    choices: ['Vehicle registration only', 'Valid driver\'s licence, log book, and vehicle inspection report', 'Insurance papers only', 'Bill of lading only'],
    correct: 1,
    explanation: 'Commercial drivers must carry their valid licence, a current log book (or ELD records), and the most recent daily inspection report.',
  },
  {
    id: 5,
    question: 'How many hours per day is a commercial truck driver allowed to drive under Ontario regulations?',
    choices: ['10 hours', '12 hours', '13 hours', '16 hours'],
    correct: 2,
    explanation: 'Ontario regulations allow a maximum of 13 hours of driving per day within a 16-hour on-duty window.',
  },
 
  // ── PRE-TRIP INSPECTION ────────────────────────────────────
  {
    id: 6,
    question: 'How often must a commercial vehicle driver complete a circle check (pre-trip inspection)?',
    choices: ['Once a week', 'Once a day before driving', 'Every time you take over a vehicle or at least once every 24 hours', 'Only when crossing provincial borders'],
    correct: 2,
    explanation: 'A circle check must be completed every time you take over a vehicle and at least once every 24 hours. The results must be recorded in a Daily Inspection Report.',
  },
  {
    id: 7,
    question: 'What must be checked during a circle check of a commercial vehicle?',
    choices: [
      'Only tires and lights',
      'Tires, brakes, lights, mirrors, coupling devices, cargo securement, and fluid levels',
      'Only the engine oil and fuel',
      'Only the cargo weight',
    ],
    correct: 1,
    explanation: 'A complete circle check covers tires, brakes, lights, mirrors, steering, coupling devices, cargo securement, fluid levels, and more.',
  },
  {
    id: 8,
    question: 'What is the minimum tire tread depth required for front (steering) tires on a commercial vehicle?',
    choices: ['1.0 mm', '2.0 mm', '4.8 mm (6/32 inch)', '3.2 mm (4/32 inch)'],
    correct: 2,
    explanation: 'Front (steering) axle tires must have a minimum of 4.8 mm (6/32 inch) of tread depth. Other tires require a minimum of 3.2 mm.',
  },
  {
    id: 9,
    question: 'What should you do if you find a defect during your pre-trip inspection that affects safety?',
    choices: [
      'Note it in the log and drive anyway',
      'Drive slowly to the nearest garage',
      'Remove the vehicle from service until the defect is repaired',
      'Report it at the end of the shift',
    ],
    correct: 2,
    explanation: 'Any defect that affects the safe operation of a vehicle must be repaired before the vehicle is driven. You must NOT drive a vehicle with a major defect.',
  },
  {
    id: 10,
    question: 'What is the purpose of the Daily Inspection Report (DIR)?',
    choices: [
      'It records fuel consumption',
      'It documents the condition of the vehicle before and after a trip — required by law',
      'It tracks driving hours only',
      'It is optional paperwork for insurance purposes',
    ],
    correct: 1,
    explanation: 'The Daily Inspection Report documents vehicle condition. It is required by law, must be kept for 6 months, and must be carried in the vehicle.',
  },
 
  // ── AIR BRAKES ─────────────────────────────────────────────
  {
    id: 11,
    question: 'What is the normal operating air pressure range for air brakes?',
    choices: ['40 to 60 psi', '60 to 80 psi', '690 to 830 kPa (100 to 120 psi)', '500 to 600 kPa'],
    correct: 2,
    explanation: 'Air brake systems normally operate between 690 and 830 kPa (100 to 120 psi). The governor cuts out the compressor at the top of this range.',
  },
  {
    id: 12,
    question: 'What happens when air pressure in an air brake system drops below the low pressure warning threshold?',
    choices: [
      'The brakes automatically apply',
      'A warning light and/or buzzer activates — you must stop safely immediately',
      'The brakes release',
      'The engine shuts off',
    ],
    correct: 1,
    explanation: 'When air pressure drops to about 60 psi, a warning light and buzzer activate. You must stop safely immediately — you are about to lose braking ability.',
  },
  {
    id: 13,
    question: 'What is brake fade in air brakes?',
    choices: [
      'Brakes that are too cold to work properly',
      'Reduction in braking effectiveness caused by overheating from excessive use — common on long downhill grades',
      'A type of brake failure caused by air leaks',
      'Brakes that have been adjusted incorrectly',
    ],
    correct: 1,
    explanation: 'Brake fade occurs when heat builds up in drums from excessive braking, reducing friction and stopping power. Control speed with engine braking before using brakes on long hills.',
  },
  {
    id: 14,
    question: 'What is the proper technique for descending a long steep hill in a heavy truck?',
    choices: [
      'Use brakes continuously to control speed',
      'Coast in neutral to save fuel',
      'Select the appropriate low gear BEFORE the hill and use engine braking — apply brakes briefly and firmly if needed',
      'Use only the trailer brakes',
    ],
    correct: 2,
    explanation: 'Select a low gear before the hill. Use engine braking as your primary speed control. Apply brakes briefly and firmly (snub braking) only when needed. Never ride the brakes continuously.',
  },
  {
    id: 15,
    question: 'What is the purpose of the spring brakes (parking brakes) on a commercial vehicle?',
    choices: [
      'They are emergency brakes only',
      'They hold the vehicle when parked and apply automatically if air pressure drops too low',
      'They are only used on trailers',
      'They replace the service brakes',
    ],
    correct: 1,
    explanation: 'Spring brakes hold the vehicle when parked and automatically apply if air pressure drops critically low — this is a safety backup, not emergency braking.',
  },
 
  // ── COUPLING & UNCOUPLING ──────────────────────────────────
  {
    id: 16,
    question: 'What is a fifth wheel on a tractor-trailer?',
    choices: [
      'A spare tire',
      'The coupling device on the tractor that connects to the trailer kingpin',
      'The rear axle of the trailer',
      'A safety device for downhill driving',
    ],
    correct: 1,
    explanation: 'The fifth wheel is the coupling plate on the tractor that the trailer kingpin locks into. It must be properly secured before driving.',
  },
  {
    id: 17,
    question: 'After coupling a tractor to a trailer, how do you verify the fifth wheel is properly locked?',
    choices: [
      'Just tug the trailer and listen for a click',
      'Pull forward gently with the trailer brakes applied and check that the kingpin is fully locked in the fifth wheel jaws',
      'Only check visually from outside the truck',
      'The driver does not need to verify — the coupling locks automatically',
    ],
    correct: 1,
    explanation: 'After coupling, set the trailer brakes, then gently pull forward. The tractor should not be able to pull away. Also do a visual inspection of the fifth wheel jaws.',
  },
  {
    id: 18,
    question: 'What must you do before uncoupling a trailer?',
    choices: [
      'Just lower the landing gear and disconnect',
      'Apply the parking brakes, lower the landing gear to support the trailer, disconnect air lines and electrical cord, then release the fifth wheel',
      'Disconnect all connections first, then lower the landing gear',
      'Only lower the landing gear — the rest is not required',
    ],
    correct: 1,
    explanation: 'Proper uncoupling sequence: apply parking brakes, lower landing gear until it takes weight, disconnect air and electrical connections, then release the fifth wheel.',
  },
  {
    id: 19,
    question: 'What colour are the service (emergency) air lines and glad hands on a tractor-trailer?',
    choices: [
      'Both are red',
      'Service line is red, supply line is blue',
      'Service line is blue, supply line is red',
      'Both are yellow',
    ],
    correct: 2,
    explanation: 'The service (control) air line is BLUE. The supply (emergency) air line is RED. Remember: Blue = service, Red = supply/emergency.',
  },
  {
    id: 20,
    question: 'What is jackknifing in a tractor-trailer?',
    choices: [
      'When the trailer sways side to side',
      'When the tractor and trailer fold toward each other like a closing jackknife — caused by trailer wheel lockup',
      'When the tractor loses traction',
      'When the fifth wheel becomes unlocked while driving',
    ],
    correct: 1,
    explanation: 'Jackknifing occurs when the trailer wheels lock up during heavy braking, causing the trailer to swing toward the tractor. The tractor ends up beside the trailer forming a V-shape.',
  },
 
  // ── HOURS OF SERVICE ───────────────────────────────────────
  {
    id: 21,
    question: 'What is the maximum number of hours a commercial driver can be ON DUTY in a single day?',
    choices: ['13 hours', '14 hours', '16 hours', '18 hours'],
    correct: 2,
    explanation: 'A commercial driver can be on duty for a maximum of 16 hours per day, within which no more than 13 hours can be spent driving.',
  },
  {
    id: 22,
    question: 'How much off-duty time must a driver have before they can start a new day of driving?',
    choices: ['6 consecutive hours', '8 consecutive hours', '10 consecutive hours', '8 hours in any combination'],
    correct: 1,
    explanation: 'Drivers must have at least 8 consecutive hours off-duty before starting a new day. This reset is required to prevent fatigue.',
  },
  {
    id: 23,
    question: 'What is the maximum on-duty hours allowed in a 7-day cycle under Canadian federal regulations?',
    choices: ['60 hours', '70 hours', '80 hours', '100 hours'],
    correct: 1,
    explanation: 'Under Canadian federal regulations, a driver may not exceed 70 hours on-duty in any 7-day period (or 120 hours in 14 days under the alternate cycle).',
  },
  {
    id: 24,
    question: 'What must a driver do after 8 hours of driving without a break?',
    choices: [
      'Nothing — they can keep driving',
      'Take at least a 30-minute break before continuing to drive',
      'Switch to a co-driver',
      'Call their dispatcher',
    ],
    correct: 1,
    explanation: 'After driving for 8 hours, a driver must take at least a 30-minute break before driving again. This is required under hours of service regulations.',
  },
  {
    id: 25,
    question: 'What is an ELD (Electronic Logging Device)?',
    choices: [
      'A GPS navigation system for trucks',
      'An electronic device that automatically records driving time and hours of service to replace paper log books',
      'An emissions control device',
      'A fuel monitoring system',
    ],
    correct: 1,
    explanation: 'An ELD automatically records driving time by connecting to the engine. It replaced paper log books for most commercial drivers to improve compliance and reduce fatigue.',
  },
 
  // ── WEIGHT & DIMENSIONS ────────────────────────────────────
  {
    id: 26,
    question: 'What is the maximum allowable gross vehicle weight for a standard tractor-trailer combination in Ontario?',
    choices: ['36,000 kg', '40,000 kg', '63,500 kg', '55,000 kg'],
    correct: 2,
    explanation: 'The maximum allowable gross vehicle weight for a standard tractor-trailer in Ontario is 63,500 kg (63.5 tonnes).',
  },
  {
    id: 27,
    question: 'What is the maximum height for a commercial vehicle in Ontario?',
    choices: ['3.5 metres', '4.0 metres', '4.15 metres', '4.5 metres'],
    correct: 2,
    explanation: 'The maximum height for a commercial vehicle in Ontario is 4.15 metres (approximately 13 feet 7 inches).',
  },
  {
    id: 28,
    question: 'Why is weight distribution important when loading a commercial truck?',
    choices: [
      'It only affects fuel consumption',
      'Improper distribution affects handling, braking, tire wear, and can exceed axle weight limits — even if total weight is legal',
      'Weight distribution only matters for oversize loads',
      'It only matters on curves',
    ],
    correct: 1,
    explanation: 'Improper weight distribution can exceed legal axle weight limits (even when total weight is acceptable), cause poor handling, uneven tire wear, and dangerous braking.',
  },
  {
    id: 29,
    question: 'What is the maximum width allowed for a commercial vehicle in Ontario?',
    choices: ['2.4 metres', '2.6 metres', '2.6 metres (with mirrors up to 3.0 metres)', '3.0 metres'],
    correct: 2,
    explanation: 'Commercial vehicles may be a maximum of 2.6 metres wide. Side-view mirrors may extend up to 3.0 metres total width.',
  },
  {
    id: 30,
    question: 'When do you need a permit to operate an oversize or overweight vehicle in Ontario?',
    choices: [
      'Never — trucks can carry any load',
      'When the vehicle exceeds legal size or weight limits — a permit must be obtained before driving',
      'Only when crossing into another province',
      'Only for loads over 100,000 kg',
    ],
    correct: 1,
    explanation: 'Any vehicle exceeding the legal size or weight limits requires a Special Vehicle Configuration permit before operating on Ontario roads.',
  },
 
  // ── CARGO SECUREMENT ───────────────────────────────────────
  {
    id: 31,
    question: 'What is the minimum number of tie-downs required for cargo up to 3 metres long and under 500 kg?',
    choices: ['1', '2', '3', '4'],
    correct: 1,
    explanation: 'At least 2 tie-downs are required for cargo up to 3 metres long and under 500 kg. More may be required depending on load weight and length.',
  },
  {
    id: 32,
    question: 'The total working load limit of all tie-downs must be at least what percentage of the cargo weight?',
    choices: ['25%', '50%', '100%', '150%'],
    correct: 2,
    explanation: 'The combined working load limit of all tie-downs must be at least 50% of the cargo weight when applied from front to rear, or 100% when applied from side to side.',
  },
  {
    id: 33,
    question: 'How often must a driver check their cargo and securement during a trip?',
    choices: [
      'Only at the start of the trip',
      'After the first 80 km, then every 240 km or 3 hours (whichever comes first)',
      'Every 100 km regardless',
      'Only when stopped at weigh stations',
    ],
    correct: 1,
    explanation: 'Check cargo and securement within the first 80 km of a trip, then every 240 km or every 3 hours, whichever comes first.',
  },
  {
    id: 34,
    question: 'What must you do before transporting dangerous goods (TDG)?',
    choices: [
      'Nothing special — any driver can transport dangerous goods',
      'Have proper TDG training and certification, carry shipping documents, and have appropriate placards displayed',
      'Only notify the police before driving',
      'Only carry a fire extinguisher',
    ],
    correct: 1,
    explanation: 'Transporting dangerous goods requires TDG training/certification, proper shipping documents, correct placards, emergency response information, and appropriate equipment.',
  },
 
  // ── DRIVING TECHNIQUES ─────────────────────────────────────
  {
    id: 35,
    question: 'What is the recommended following distance for a fully loaded tractor-trailer at highway speed?',
    choices: ['2 seconds', '4 seconds', '6 seconds or more', '3 seconds'],
    correct: 2,
    explanation: 'A fully loaded tractor-trailer requires much more stopping distance than a car. Maintain at least 6 seconds of following distance — more in bad weather.',
  },
  {
    id: 36,
    question: 'When making a right turn in a tractor-trailer, you should:',
    choices: [
      'Stay as far right as possible throughout the turn',
      'Set up wide to the left first, then turn right — the trailer will cut the corner',
      'Turn quickly to minimize time in the intersection',
      'Only right turns in designated truck lanes',
    ],
    correct: 1,
    explanation: 'Large trucks must "swing wide" — move left before initiating a right turn. This compensates for the trailer cutting the corner (off-tracking).',
  },
  {
    id: 37,
    question: 'What is "off-tracking" in a tractor-trailer?',
    choices: [
      'When the truck drifts off the road',
      'The tendency of the rear trailer axles to follow a shorter path than the front axles through a turn',
      'When the trailer fishtails on slippery roads',
      'When the load shifts during a turn',
    ],
    correct: 1,
    explanation: 'Off-tracking means the trailer wheels follow a tighter (shorter) path than the tractor during turns. This is why large trucks need more clearance on curves and intersections.',
  },
  {
    id: 38,
    question: 'When backing a tractor-trailer, which direction should you turn the steering wheel to move the trailer to the right?',
    choices: ['Turn right', 'Turn left', 'The wheel does not affect trailer direction when backing', 'Turn right first then quickly left'],
    correct: 1,
    explanation: 'When backing a trailer, turn the steering wheel LEFT to move the trailer RIGHT. It is the opposite of regular driving — the trailer moves opposite to the wheel direction.',
  },
  {
    id: 39,
    question: 'What is "trailer sway" and how do you correct it?',
    choices: [
      'A trailer swaying side to side — correct by braking hard',
      'A trailer swaying side to side — ease off the accelerator, do not steer against it, do not brake',
      'A trailer pulling to one side — correct by adding more air to tires',
      'Normal trailer movement at highway speeds',
    ],
    correct: 1,
    explanation: 'Trailer sway (fishtailing) is dangerous. Ease off the accelerator gradually. Do not steer against the sway or brake — this makes it worse. Let the truck slow naturally.',
  },
  {
    id: 40,
    question: 'How does a loaded truck compare to an empty truck in terms of braking?',
    choices: [
      'A loaded truck always stops faster due to traction',
      'An empty truck can require as much or more stopping distance than a loaded truck due to reduced traction on drive axles',
      'There is no difference',
      'A loaded truck always takes longer to stop',
    ],
    correct: 1,
    explanation: 'Empty trucks have less traction on drive axles, making wheels more likely to lock up. Stopping distances for empty trucks can be comparable to or exceed loaded trucks.',
  },
 
  // ── WEATHER & SPECIAL CONDITIONS ───────────────────────────
  {
    id: 41,
    question: 'In Ontario, when must commercial trucks have winter tires or chains installed?',
    choices: [
      'Never — they are not required',
      'From November 1 to March 31',
      'When driving on designated routes or when required by road conditions and signage',
      'Only in Northern Ontario',
    ],
    correct: 2,
    explanation: 'Some routes require winter tires or chains — watch for posted signs. Even where not mandatory, winter tires or chains are strongly recommended in winter conditions.',
  },
  {
    id: 42,
    question: 'What should you do before driving a heavy truck over a bridge?',
    choices: [
      'Nothing special — bridges are built for trucks',
      'Check the posted weight limit and ensure your vehicle and load do not exceed it',
      'Only slow down when crossing',
      'Use an alternate route if available',
    ],
    correct: 1,
    explanation: 'Always check posted bridge weight limits before crossing. Exceeding the weight limit can cause serious damage or collapse.',
  },
  {
    id: 43,
    question: 'What is black ice and why is it dangerous for truck drivers?',
    choices: [
      'A dark-coloured road surface that is always slippery',
      'A thin transparent layer of ice on the road surface that is invisible and causes sudden loss of traction',
      'Ice that forms only on bridges',
      'Ice that forms in shaded areas only',
    ],
    correct: 1,
    explanation: 'Black ice is invisible and forms when moisture freezes on the road surface. It provides almost zero traction and can cause a truck to lose control with no warning.',
  },
  {
    id: 44,
    question: 'When should truck drivers increase following distance beyond the normal minimum?',
    choices: [
      'Only in rain',
      'In rain, snow, ice, fog, heavy traffic, when carrying hazardous materials, and at night',
      'Only on highways',
      'Only when carrying oversized loads',
    ],
    correct: 1,
    explanation: 'Increase following distance in any condition that reduces traction, visibility, or reaction time — rain, snow, ice, fog, darkness, heavy traffic, or hazardous cargo.',
  },
 
  // ── REGULATIONS & SAFETY ───────────────────────────────────
  {
    id: 45,
    question: 'What is the blood alcohol limit for a commercial vehicle driver in Ontario?',
    choices: ['0.08%', '0.05%', '0.00% — zero tolerance', '0.03%'],
    correct: 2,
    explanation: 'Commercial vehicle drivers in Ontario have zero tolerance for alcohol. Any blood alcohol level will result in immediate licence suspension.',
  },
  {
    id: 46,
    question: 'What must you do at a railway crossing with a commercial vehicle?',
    choices: [
      'Slow down and proceed if no train is visible',
      'Stop within 5 to 15 metres of the nearest rail, open the window and door, listen and look both ways before crossing',
      'Use your horn and proceed quickly',
      'Only stop if the signal is active',
    ],
    correct: 1,
    explanation: 'Commercial vehicles must ALWAYS stop at railway crossings (5 to 15 metres from nearest rail), open the door and window, look and listen both ways before crossing.',
  },
  {
    id: 47,
    question: 'What is a weigh station (Commercial Vehicle Inspection Station) and when must you stop?',
    choices: [
      'Optional stops for weight verification',
      'Mandatory inspection stations — all commercial vehicles must stop when the light is on or when directed',
      'Only required for oversize loads',
      'Only for vehicles over 36,000 kg',
    ],
    correct: 1,
    explanation: 'Weigh stations are mandatory inspection points. All commercial vehicles must stop when directed or when the open light is on. Failing to stop is a serious offence.',
  },
  {
    id: 48,
    question: 'What must you do when involved in a collision with a commercial vehicle?',
    choices: [
      'Exchange information and leave if damage is under $2,000',
      'Stop, render aid, secure the scene, call police, and report to a Collision Reporting Centre if required',
      'Call your dispatcher first before anything else',
      'Only stop if someone is injured',
    ],
    correct: 1,
    explanation: 'You must stop, render aid, secure the scene, and report to police. Commercial vehicle accidents must be reported regardless of damage amount.',
  },
  {
    id: 49,
    question: 'What is the purpose of the CVOR (Commercial Vehicle Operator\'s Registration)?',
    choices: [
      'A fuel tax certificate',
      'A registration system that tracks safety records of commercial vehicle operators — carriers with poor records face audits and sanctions',
      'A vehicle insurance certificate',
      'A weight permit',
    ],
    correct: 1,
    explanation: 'The CVOR tracks the safety performance of commercial vehicle operators. Poor safety records can result in audits, warnings, fines, or suspension of operating authority.',
  },
  {
    id: 50,
    question: 'What must you do if your vehicle breaks down on a highway?',
    choices: [
      'Stay in the vehicle and wait',
      'Turn on four-way flashers, place warning devices (triangles or flares) behind the vehicle, and call for assistance',
      'Walk to the nearest exit for help',
      'Only call your dispatcher',
    ],
    correct: 1,
    explanation: 'Immediately turn on four-way flashers. Place warning devices at 30 metres, 90 metres, and 150 metres behind the vehicle. Call for assistance and stay well off the roadway.',
  },
 
  // ── FUEL & ENVIRONMENT ─────────────────────────────────────
  {
    id: 51,
    question: 'What is the purpose of an IFTA (International Fuel Tax Agreement) sticker?',
    choices: [
      'It is a safety inspection sticker',
      'It allows commercial vehicles to travel across jurisdictions and pay fuel taxes based on miles driven in each jurisdiction',
      'It is a customs document for US border crossings',
      'It tracks vehicle weight',
    ],
    correct: 1,
    explanation: 'IFTA simplifies fuel tax reporting for carriers operating in multiple jurisdictions. Taxes are calculated based on distance driven in each province/state.',
  },
  {
    id: 52,
    question: 'What does the term "gross vehicle weight rating" (GVWR) mean?',
    choices: [
      'The weight of the vehicle when empty',
      'The maximum weight the vehicle is designed to carry including its own weight and full load',
      'The weight of only the cargo',
      'The registered weight on the licence plate',
    ],
    correct: 1,
    explanation: 'GVWR is the maximum allowable total weight of a vehicle including its own weight, passengers, fuel, and cargo as specified by the manufacturer.',
  },
  {
    id: 53,
    question: 'What is the purpose of retarders (jake brakes) on heavy trucks?',
    choices: [
      'To improve acceleration',
      'To provide additional braking force using the engine to slow the vehicle on downhill grades without using service brakes',
      'Only to slow down in emergency stops',
      'They are a type of parking brake',
    ],
    correct: 1,
    explanation: 'Engine retarders (jake brakes) slow the truck using engine compression, reducing wear on service brakes during long descents. Note: many areas restrict their use in residential zones.',
  },
  {
    id: 54,
    question: 'What do you do if a tire blows out on the front (steering) axle while driving?',
    choices: [
      'Brake hard immediately to stop',
      'Hold the steering wheel firmly with both hands, ease off the throttle, and steer to a safe stop without braking suddenly',
      'Swerve away from the blowout direction',
      'Accelerate to maintain control',
    ],
    correct: 1,
    explanation: 'A front tire blowout can cause severe pulling. Hold the wheel firmly, ease off the accelerator, and allow the truck to slow gradually. Avoid sudden braking which can cause loss of control.',
  },
  {
    id: 55,
    question: 'What is the correct procedure when parking a tractor-trailer on a hill?',
    choices: [
      'Apply spring brakes only',
      'Apply spring brakes, chock the wheels, and turn the wheels toward the curb if facing downhill or away from the curb if facing uphill',
      'Leave it in gear and apply the foot brake',
      'Apply service brakes and leave the engine running',
    ],
    correct: 1,
    explanation: 'Apply spring brakes, chock the wheels, and turn the wheels appropriately. Never rely on service brakes alone when parked on a hill.',
  },
 
  // ── TRUCK-SPECIFIC SITUATIONS ──────────────────────────────
  {
    id: 56,
    question: 'What is a "squeeze play" hazard for truck drivers in urban areas?',
    choices: [
      'When two trucks must pass on a narrow road',
      'When a truck driver is cut off by a car merging from a ramp',
      'When a car is alongside a turning truck and gets trapped between the truck and the curb as the trailer cuts the corner',
      'When traffic is compressed near a construction zone',
    ],
    correct: 2,
    explanation: 'A "squeeze play" happens when a car stays alongside a truck during a right turn and gets trapped as the trailer swings wide. Always watch for vehicles beside your trailer when turning.',
  },
  {
    id: 57,
    question: 'What are "No Zones" around a tractor-trailer?',
    choices: [
      'Zones where trucks cannot legally drive',
      'Large blind spot areas directly behind, in front, and beside a truck where other vehicles are invisible to the driver',
      'Restricted parking areas for trucks',
      'Speed restricted areas near schools',
    ],
    correct: 1,
    explanation: 'No Zones are the large blind spots around a truck — directly behind (longest), directly in front, and on both sides. Vehicles in these zones cannot be seen by the truck driver.',
  },
  {
    id: 58,
    question: 'How does driving in high winds affect a tractor-trailer?',
    choices: [
      'It has minimal effect on a large truck',
      'High winds can cause the trailer to sway, especially when empty — reduce speed and maintain firm control of steering',
      'Only affects loaded trailers',
      'Only a concern when the wind is crosswise',
    ],
    correct: 1,
    explanation: 'High-sided trailers act like sails. Empty trailers are more susceptible to wind. Reduce speed, grip the wheel firmly, and be extra cautious on bridges and overpasses.',
  },
  {
    id: 59,
    question: 'What does a yellow/amber rotating or flashing light on a slow-moving vehicle indicate?',
    choices: [
      'An emergency vehicle',
      'A vehicle that is oversized, slow-moving, or a pilot vehicle — proceed with caution',
      'A vehicle with a mechanical fault',
      'A school bus',
    ],
    correct: 1,
    explanation: 'Amber rotating or flashing lights indicate slow-moving vehicles, wide loads, or escort/pilot vehicles. Slow down, proceed with caution, and be prepared to stop.',
  },
  {
    id: 60,
    question: 'What is the purpose of landing gear on a semi-trailer?',
    choices: [
      'It is an aircraft-type landing system',
      'Retractable legs that support the front of the trailer when it is uncoupled from the tractor',
      'Safety devices that prevent trailer sway',
      'Emergency brakes for the trailer',
    ],
    correct: 1,
    explanation: 'Landing gear (legs) are cranked down to support the front of the trailer when it is detached from the tractor. They must be raised before driving.',
  },
];
 
// ── Alberta Class 5 Knowledge Test — 40 Questions ────────────
const ALBERTA_QUESTIONS = [
  { id:1,  question:'What is the default speed limit in an urban area in Alberta unless posted otherwise?', choices:['40 km/h','50 km/h','60 km/h','70 km/h'], correct:1, explanation:'The default speed limit in urban areas in Alberta is 50 km/h unless a sign indicates otherwise.' },
  { id:2,  question:'What is the maximum speed limit on most Alberta highways?', choices:['90 km/h','100 km/h','110 km/h','120 km/h'], correct:2, explanation:'The maximum speed limit on most Alberta highways is 110 km/h unless posted otherwise.' },
  { id:3,  question:'What is the blood alcohol concentration (BAC) limit for a fully licensed driver in Alberta?', choices:['0.05%','0.08%','0.10%','0.00%'], correct:1, explanation:'The legal limit in Alberta is 0.08%. However, at 0.05% you face immediate licence suspension under the warn range.' },
  { id:4,  question:'What BAC level results in an immediate roadside licence suspension in Alberta?', choices:['0.02%','0.04%','0.05%','0.08%'], correct:2, explanation:'In Alberta, a BAC of 0.05% or higher results in an immediate roadside licence suspension — even though the criminal threshold is 0.08%.' },
  { id:5,  question:'What is Alberta\'s Graduated Driver Licensing (GDL) program?', choices:['A points-based demerit system only','A two-stage learning system (Learner Stage and Probationary Stage) before a full licence','A commercial driving program','An advanced driver training course'], correct:1, explanation:'Alberta\'s GDL program has two stages: the Learner Stage (minimum 1 year) and the Probationary Stage (minimum 2 years), each with restrictions.' },
  { id:6,  question:'During the Learner Stage in Alberta, what is the blood alcohol limit?', choices:['0.05%','0.08%','0.00% — zero tolerance','0.03%'], correct:2, explanation:'Learner and Probationary stage drivers must have zero blood alcohol. Any amount is a violation.' },
  { id:7,  question:'How long must you hold a Learner licence in Alberta before advancing to the Probationary stage?', choices:['6 months','12 months','18 months','24 months'], correct:1, explanation:'You must hold your Learner licence for at least 12 months before taking the road test to advance to the Probationary stage.' },
  { id:8,  question:'In Alberta, when must a Learner driver be accompanied?', choices:['Only on highways','At all times by a fully licensed driver with at least 2 years experience sitting in the front passenger seat','Only at night','Only when driving outside the city'], correct:1, explanation:'A Learner must always be accompanied by a fully licensed driver with at least 2 years experience seated in the front passenger seat.' },
  { id:9,  question:'What is the speed limit in a school zone in Alberta?', choices:['20 km/h','30 km/h','40 km/h','50 km/h'], correct:1, explanation:'School zones in Alberta have a speed limit of 30 km/h during school hours (on school days, typically 8 am to 4:30 pm).' },
  { id:10, question:'What is the speed limit in a playground zone in Alberta?', choices:['20 km/h','30 km/h','40 km/h','50 km/h'], correct:0, explanation:'Playground zones in Alberta have a speed limit of 20 km/h during posted hours (typically sunrise to sunset).' },
  { id:11, question:'When must you signal before turning in Alberta?', choices:['Only at intersections with traffic lights','At least 30 metres before turning or changing lanes','Only on highways','Only when other vehicles are present'], correct:1, explanation:'Alberta law requires signalling at least 30 metres before turning or changing lanes.' },
  { id:12, question:'When approaching a school bus with flashing red lights on an undivided road in Alberta, you must:', choices:['Slow to 20 km/h and proceed','Stop from both directions until the lights stop','Only stop if you are behind the bus','Only stop during school hours'], correct:1, explanation:'On undivided roads, all traffic from both directions must stop when a school bus has flashing red lights. Wait until the lights stop flashing.' },
  { id:13, question:'What is the Move Over law in Alberta?', choices:['A lane change rule for highways','You must slow down and move over when passing emergency vehicles, tow trucks, and highway maintenance vehicles stopped with lights flashing','A rule about yielding to merging traffic','Vehicles must keep right on multi-lane roads'], correct:1, explanation:'Alberta\'s Move Over law requires drivers to slow down and move over when passing any stopped vehicle with flashing lights on the roadside.' },
  { id:14, question:'In Alberta, how far must you park from a fire hydrant?', choices:['1 metre','3 metres','5 metres','6 metres'], correct:2, explanation:'You must not park within 5 metres of a fire hydrant in Alberta.' },
  { id:15, question:'When can you turn right on a red light in Alberta?', choices:['Never','After a complete stop, yielding to pedestrians and traffic, unless a sign prohibits it','Anytime without stopping','Only between 10 pm and 6 am'], correct:1, explanation:'You may turn right on red after making a complete stop and yielding to all traffic and pedestrians, unless a NO RIGHT TURN ON RED sign is posted.' },
  { id:16, question:'In Alberta, what is the minimum following distance recommended?', choices:['1 second','2 seconds','3 seconds','4 seconds'], correct:1, explanation:'Alberta recommends a minimum 2-second following distance. Increase to 4 or more seconds in poor weather conditions.' },
  { id:17, question:'In Alberta, when approaching an uncontrolled intersection, who has the right of way?', choices:['The driver on the larger road','The driver who arrives first; if simultaneous, yield to the driver on your right','The driver going straight','The driver turning left'], correct:1, explanation:'At uncontrolled intersections the first to arrive has right of way. If arriving at the same time, yield to the vehicle on your right.' },
  { id:18, question:'What must you do before entering a traffic circle (roundabout) in Alberta?', choices:['You have right of way when entering','Yield to all vehicles already in the roundabout','Stop completely before entering','Flash your lights to signal entry'], correct:1, explanation:'Always yield to vehicles already circulating in the roundabout. Enter only when there is a safe gap.' },
  { id:19, question:'What does a flashing green light mean in Alberta?', choices:['Proceed with caution','Protected turn — you have an advance green signal with right of way','The light is about to turn yellow','Yield to pedestrians'], correct:1, explanation:'A flashing green in Alberta means you have a protected advance signal — you may go straight or turn. Oncoming traffic is stopped.' },
  { id:20, question:'In Alberta, using a handheld cell phone while driving results in:', choices:['A verbal warning only','A fine and 3 demerit points','Only a fine — no demerit points','Just a fine for first offence only'], correct:1, explanation:'Distracted driving in Alberta carries a fine and 3 demerit points. Repeat offences within 2 years result in higher fines.' },
  { id:21, question:'What is the demerit point system in Alberta?', choices:['Points added for good driving','Points added for traffic violations — accumulating too many results in licence suspension','Points deducted from a starting total','Points only apply to new drivers'], correct:1, explanation:'Alberta\'s demerit system adds points for violations. Fully licensed drivers face suspension at 15 points. GDL drivers face suspension at 8 points.' },
  { id:22, question:'How many demerit points does running a red light carry in Alberta?', choices:['2 points','3 points','4 points','6 points'], correct:1, explanation:'Running a red light in Alberta results in 3 demerit points and a fine.' },
  { id:23, question:'When must you use your headlights in Alberta?', choices:['Only at night','From 30 minutes after sunset to 30 minutes before sunrise and whenever visibility is reduced','Only in rain and snow','Only on highways'], correct:1, explanation:'Alberta requires headlights from 30 minutes after sunset to 30 minutes before sunrise and whenever visibility is poor.' },
  { id:24, question:'In Alberta, when is it legal to pass on the right?', choices:['Never','When the vehicle ahead is turning left and there is a clear lane to the right','Anytime on a multi-lane road','Only on highways'], correct:1, explanation:'You may pass on the right only when the vehicle ahead is making a left turn and there is sufficient room. Do not drive off the paved surface.' },
  { id:25, question:'What must you do when an emergency vehicle with lights and siren approaches from behind in Alberta?', choices:['Speed up to get out of the way','Pull to the right side and stop until it passes','Continue at the same speed in your lane','Pull to the left side'], correct:1, explanation:'Pull to the right side of the road and stop. Wait until the emergency vehicle has completely passed before continuing.' },
  { id:26, question:'In Alberta, what is the penalty for distracted driving causing death?', choices:['$1,000 fine and 3 demerit points','Up to $1,200 fine and 6 demerit points','Criminal charges under the Criminal Code of Canada','The same as a regular distracted driving fine'], correct:2, explanation:'Distracted driving causing death is a criminal offence under the Criminal Code. Provincial penalties also apply in addition to criminal charges.' },
  { id:27, question:'What does a solid white line separating lanes mean in Alberta?', choices:['You may cross it to change lanes','Do not cross — it marks a boundary you should not pass','Passing zone ahead','Bicycle lane marker'], correct:1, explanation:'A solid white line marks a lane boundary that should not be crossed, such as the edge of the road or a designated lane boundary.' },
  { id:28, question:'What is the correct action when you see a yellow traffic light in Alberta?', choices:['Speed up to clear the intersection','Stop if you can do so safely — the light is about to turn red','Proceed — yellow means caution only','Yield to pedestrians and continue'], correct:1, explanation:'A yellow light means the signal is changing to red. Stop safely if you can. Do not speed up to beat the light.' },
  { id:29, question:'In Alberta, what must you do at a stop sign?', choices:['Slow down and check for traffic','Stop completely at the stop line, yield to all traffic, then proceed when safe','Stop only if other vehicles are present','Treat it as a yield sign during off-peak hours'], correct:1, explanation:'You must make a complete stop at the stop line (or before the crosswalk/intersection). Yield to all traffic and pedestrians before proceeding.' },
  { id:30, question:'When driving in fog in Alberta, you should use:', choices:['High-beam headlights for maximum visibility','Low-beam headlights — high beams reflect off fog','Hazard lights only','No special lighting is needed'], correct:1, explanation:'Use low-beam headlights in fog. High beams reflect off fog particles and reduce your visibility significantly.' },
  { id:31, question:'What is the minimum age to apply for a Class 5 Learner licence in Alberta?', choices:['14 years old','16 years old','17 years old','18 years old'], correct:1, explanation:'You must be at least 16 years old to apply for a Class 5 Learner licence in Alberta.' },
  { id:32, question:'In Alberta, where must you yield to pedestrians?', choices:['Only at marked crosswalks with traffic lights','At all crosswalks — marked or unmarked — and intersection corners','Only when a pedestrian steps into the road','Only in school zones'], correct:1, explanation:'In Alberta you must yield to pedestrians at all crosswalks whether marked or unmarked. This includes any intersection corner.' },
  { id:33, question:'What is the speed limit in an alley in Alberta?', choices:['15 km/h','20 km/h','30 km/h','40 km/h'], correct:1, explanation:'The speed limit in alleys in Alberta is 20 km/h.' },
  { id:34, question:'When should you increase your following distance beyond 2 seconds in Alberta?', choices:['Only in snow','In rain, snow, ice, fog, heavy traffic, at night, or when towing','Only on gravel roads','Only on highways above 100 km/h'], correct:1, explanation:'Increase following distance in any condition that reduces traction or visibility — rain, snow, ice, fog, darkness, heavy traffic, or towing.' },
  { id:35, question:'What does a broken yellow centre line mean on a two-lane road in Alberta?', choices:['No passing in either direction','Passing is permitted when safe to do so','Construction zone ahead','Two-way left-turn lane'], correct:1, explanation:'A broken yellow centre line means passing is permitted from either side when it is safe to do so.' },
  { id:36, question:'In Alberta, how many demerit points results in a licence suspension for a fully licensed driver?', choices:['8 points','10 points','12 points','15 points'], correct:3, explanation:'A fully licensed driver in Alberta faces a 30-day licence suspension after accumulating 15 or more demerit points.' },
  { id:37, question:'What is the purpose of the safe driving record in Alberta?', choices:['It gives you points for good driving that offset demerits','It tracks violations only — there are no positive points','It reduces your insurance rate automatically','It allows you to exceed speed limits by 10 km/h'], correct:1, explanation:'Alberta\'s demerit system only tracks violations. There are no positive points — violations add demerit points until the threshold for suspension is reached.' },
  { id:38, question:'When reversing in Alberta, you must:', choices:['Check only your rear-view mirror','Look over your shoulder in the direction you are moving and check all mirrors','Signal and reverse quickly','Only check for pedestrians'], correct:1, explanation:'When reversing always look over your shoulder in the direction of travel and check all mirrors. Never rely on mirrors alone.' },
  { id:39, question:'In Alberta, you must report a collision to police when total damage exceeds:', choices:['$1,000','$2,000','$5,000','$10,000'], correct:1, explanation:'In Alberta, collisions must be reported to police when total damage to vehicles and property exceeds $2,000.' },
  { id:40, question:'What does a double solid yellow centre line mean in Alberta?', choices:['Passing permitted from both sides','No passing from either direction — do not cross the line','Construction zone warning','Divided highway begins'], correct:1, explanation:'A double solid yellow centre line means passing is prohibited from both directions. Do not cross this marking.' },
];

// ── Canadian Citizenship Test — 60 Questions ─────────────────
// Add to ALL_QUESTIONS in quiz/[testSlug]/page.jsx
// Change: 'citizenship': CITIZENSHIP_QUESTIONS,
// To:     'citizenship': CITIZENSHIP_QUESTIONS_FULL.slice(0, 5),

const CITIZENSHIP_QUESTIONS_FULL = [

  // ── CANADA'S HISTORY ──────────────────────────────────────
  {
    id: 1,
    question: 'What is the capital city of Canada?',
    choices: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'],
    correct: 2,
    explanation: 'Ottawa, Ontario is the capital city of Canada. It has been the capital since 1857 when Queen Victoria chose it.',
  },
  {
    id: 2,
    question: 'When did Canada become a country (Confederation)?',
    choices: ['July 1, 1776', 'July 1, 1867', 'July 1, 1900', 'July 1, 1931'],
    correct: 1,
    explanation: 'Canada became a country on July 1, 1867 when the British North America Act united Ontario, Quebec, Nova Scotia, and New Brunswick.',
  },
  {
    id: 3,
    question: 'Who were the first people to live in Canada?',
    choices: ['The French settlers', 'The British colonists', 'The Aboriginal peoples — First Nations, Métis, and Inuit', 'The Vikings'],
    correct: 2,
    explanation: 'Aboriginal peoples — First Nations, Métis, and Inuit — were the first inhabitants of Canada, living here for thousands of years before European contact.',
  },
  {
    id: 4,
    question: 'What are Canada\'s two official languages?',
    choices: ['English and French', 'English and Spanish', 'English and Indigenous languages', 'French and Spanish'],
    correct: 0,
    explanation: 'English and French are Canada\'s two official languages. This reflects the two main founding European groups who shaped the country.',
  },
  {
    id: 5,
    question: 'What does "Confederation" mean in Canadian history?',
    choices: ['Canada\'s independence from the United States', 'The joining together of provinces to form Canada in 1867', 'Canada\'s entry into the First World War', 'The signing of the Charter of Rights and Freedoms'],
    correct: 1,
    explanation: 'Confederation refers to the joining of the original provinces to form Canada in 1867 under the British North America Act.',
  },
  {
    id: 6,
    question: 'What is the name of Canada\'s national anthem?',
    choices: ['The Maple Leaf Forever', 'God Save the King', 'O Canada', 'True North Strong and Free'],
    correct: 2,
    explanation: 'O Canada is the national anthem. It was originally written in French in 1880 and officially adopted as the national anthem in 1980.',
  },
  {
    id: 7,
    question: 'What do you call the Queen or King of Canada\'s representative in each province?',
    choices: ['The Premier', 'The Lieutenant Governor', 'The Mayor', 'The Senator'],
    correct: 1,
    explanation: 'The Lieutenant Governor represents the King or Queen in each province. At the federal level, the Governor General represents the monarch.',
  },
  {
    id: 8,
    question: 'Which European explorer is credited with the first European contact with Canada\'s mainland?',
    choices: ['Christopher Columbus', 'Jacques Cartier', 'John Cabot', 'Samuel de Champlain'],
    correct: 2,
    explanation: 'John Cabot, sailing for England in 1497, reached the eastern coast of Canada (likely Newfoundland or Cape Breton), marking the first documented European contact with mainland Canada.',
  },
  {
    id: 9,
    question: 'Who founded the city of Quebec in 1608?',
    choices: ['Jacques Cartier', 'John Cabot', 'Samuel de Champlain', 'Pierre Trudeau'],
    correct: 2,
    explanation: 'Samuel de Champlain founded Quebec City in 1608, establishing one of the first permanent European settlements in North America.',
  },
  {
    id: 10,
    question: 'What was the significance of the Battle of the Plains of Abraham (1759)?',
    choices: ['Canada gained independence from Britain', 'Britain defeated France — ending French control of New France', 'Canada joined the Commonwealth', 'The Métis people established their homeland'],
    correct: 1,
    explanation: 'The Battle of the Plains of Abraham in 1759 was a decisive British victory over France, ending French colonial rule in New France and shaping Canada\'s future as a British colony.',
  },

  // ── GOVERNMENT & DEMOCRACY ────────────────────────────────
  {
    id: 11,
    question: 'What are the three levels of government in Canada?',
    choices: ['Federal, Provincial, and Municipal', 'National, Regional, and Local', 'Senate, House of Commons, and Courts', 'Crown, Parliament, and Cabinet'],
    correct: 0,
    explanation: 'Canada has three levels of government: Federal (national), Provincial/Territorial, and Municipal (city/town). Each has different responsibilities.',
  },
  {
    id: 12,
    question: 'Who is the head of state of Canada?',
    choices: ['The Prime Minister', 'The President', 'The King or Queen of Canada', 'The Governor General'],
    correct: 2,
    explanation: 'The King or Queen of Canada is the head of state. Currently King Charles III. The Governor General represents the monarch in Canada.',
  },
  {
    id: 13,
    question: 'Who is the head of government in Canada?',
    choices: ['The Governor General', 'The King or Queen', 'The Prime Minister', 'The Speaker of the House'],
    correct: 2,
    explanation: 'The Prime Minister is the head of government and leads the Cabinet. The Prime Minister is the leader of the party with the most seats in the House of Commons.',
  },
  {
    id: 14,
    question: 'What is the Parliament of Canada made up of?',
    choices: ['The Senate only', 'The House of Commons only', 'The King or Queen, the Senate, and the House of Commons', 'The Prime Minister and the Cabinet'],
    correct: 2,
    explanation: 'Parliament consists of three parts: the King or Queen (represented by the Governor General), the Senate (appointed), and the House of Commons (elected).',
  },
  {
    id: 15,
    question: 'How are members of the House of Commons chosen?',
    choices: ['They are appointed by the Prime Minister', 'They are elected by Canadian citizens', 'They are chosen by the Senate', 'They are appointed by the Governor General'],
    correct: 1,
    explanation: 'Members of Parliament (MPs) in the House of Commons are elected by Canadian citizens through general elections.',
  },
  {
    id: 16,
    question: 'How are Senators chosen in Canada?',
    choices: ['Elected by Canadians', 'Appointed by the Governor General on the advice of the Prime Minister', 'Appointed by provincial premiers', 'Chosen by the House of Commons'],
    correct: 1,
    explanation: 'Senators are appointed by the Governor General on the advice of the Prime Minister. There are 105 Senate seats representing provinces and territories.',
  },
  {
    id: 17,
    question: 'What is a "riding" in Canadian politics?',
    choices: ['A term for horseback patrol by the RCMP', 'An electoral district that elects one Member of Parliament', 'A provincial boundary', 'A Senate division'],
    correct: 1,
    explanation: 'A riding (also called an electoral district or constituency) is the geographic area that elects one Member of Parliament to the House of Commons.',
  },
  {
    id: 18,
    question: 'What is the role of the Governor General?',
    choices: ['To lead the Canadian military', 'To represent the King or Queen of Canada and carry out constitutional duties', 'To lead the Senate', 'To appoint the Prime Minister directly'],
    correct: 1,
    explanation: 'The Governor General represents the King or Queen, reads the Speech from the Throne, gives Royal Assent to legislation, and performs other constitutional duties.',
  },
  {
    id: 19,
    question: 'What is "responsible government" in Canada?',
    choices: ['A government that balances the budget', 'The principle that the government must have the confidence of the elected House of Commons to remain in power', 'Government accountability to the Senate', 'The Prime Minister being responsible for all decisions'],
    correct: 1,
    explanation: 'Responsible government means the Cabinet must maintain the confidence (support) of the elected House of Commons. If they lose a confidence vote, an election must be called.',
  },
  {
    id: 20,
    question: 'What is the role of Members of Parliament (MPs)?',
    choices: ['To enforce laws', 'To represent the people of their riding, debate and pass laws, and hold the government accountable', 'To appoint judges', 'To manage municipal services'],
    correct: 1,
    explanation: 'MPs represent their constituents, debate and vote on legislation, scrutinize government spending, and hold the government accountable in the House of Commons.',
  },

  // ── RIGHTS & FREEDOMS ──────────────────────────────────────
  {
    id: 21,
    question: 'What is the Canadian Charter of Rights and Freedoms?',
    choices: ['A document listing Canada\'s trade agreements', 'Part of Canada\'s Constitution that guarantees the fundamental rights and freedoms of all Canadians', 'The original British North America Act', 'A list of Canadian immigration rules'],
    correct: 1,
    explanation: 'The Canadian Charter of Rights and Freedoms (1982) is part of the Constitution and guarantees fundamental rights including freedom of expression, religion, equality rights, and legal rights.',
  },
  {
    id: 22,
    question: 'When was the Canadian Charter of Rights and Freedoms enacted?',
    choices: ['1867', '1931', '1982', '1999'],
    correct: 2,
    explanation: 'The Charter of Rights and Freedoms was enacted in 1982 as part of the Constitution Act, signed by Prime Minister Pierre Elliott Trudeau.',
  },
  {
    id: 23,
    question: 'Which of the following is NOT guaranteed by the Canadian Charter of Rights and Freedoms?',
    choices: ['Freedom of religion', 'Freedom of expression', 'The right to a guaranteed income', 'The right to a fair trial'],
    correct: 2,
    explanation: 'The Charter guarantees freedoms of religion, expression, and legal rights like a fair trial. A guaranteed income is a social policy, not a Charter right.',
  },
  {
    id: 24,
    question: 'What are the fundamental freedoms guaranteed in the Charter?',
    choices: ['Freedom of speech only', 'Freedom of conscience, religion, expression, peaceful assembly, and association', 'Freedom from paying taxes', 'Freedom to enter any country'],
    correct: 1,
    explanation: 'The fundamental freedoms are: conscience and religion, thought, belief, opinion and expression (including press), peaceful assembly, and association.',
  },
  {
    id: 25,
    question: 'What does "equality rights" mean in the Charter?',
    choices: ['All people must earn the same income', 'Every individual is equal before the law without discrimination based on race, sex, age, religion, or disability', 'Only Canadian citizens have rights', 'All provinces must have equal populations'],
    correct: 1,
    explanation: 'Equality rights mean that every individual is equal before and under the law, with equal protection regardless of race, national origin, colour, religion, sex, age, or mental or physical disability.',
  },
  {
    id: 26,
    question: 'What is the role of the Supreme Court of Canada?',
    choices: ['To make new laws', 'To be the final court of appeal and interpret the Constitution and laws', 'To elect the Prime Minister', 'To manage federal finances'],
    correct: 1,
    explanation: 'The Supreme Court of Canada is the highest court in the land, serving as the final court of appeal. It interprets the Constitution and ensures laws comply with the Charter.',
  },

  // ── SYMBOLS & GEOGRAPHY ────────────────────────────────────
  {
    id: 27,
    question: 'How many provinces and territories does Canada have?',
    choices: ['10 provinces and 2 territories', '10 provinces and 3 territories', '12 provinces and 1 territory', '9 provinces and 3 territories'],
    correct: 1,
    explanation: 'Canada has 10 provinces and 3 territories (Yukon, Northwest Territories, and Nunavut), for a total of 13.',
  },
  {
    id: 28,
    question: 'What is Canada\'s national symbol?',
    choices: ['The bald eagle', 'The maple leaf', 'The beaver', 'The moose'],
    correct: 1,
    explanation: 'The maple leaf is Canada\'s most recognized national symbol, appearing on the Canadian flag. The beaver is also an official symbol of Canadian sovereignty.',
  },
  {
    id: 29,
    question: 'What are the colours of the Canadian flag?',
    choices: ['Red and white', 'Red, white, and blue', 'Red and blue', 'Blue and white'],
    correct: 0,
    explanation: 'The Canadian flag is red and white with a red maple leaf in the centre. It was officially adopted on February 15, 1965.',
  },
  {
    id: 30,
    question: 'Which is the largest province in Canada by area?',
    choices: ['Ontario', 'British Columbia', 'Alberta', 'Quebec'],
    correct: 3,
    explanation: 'Quebec is the largest province in Canada by land area, covering approximately 1.5 million square kilometres.',
  },
  {
    id: 31,
    question: 'Which is the most populous province in Canada?',
    choices: ['Quebec', 'British Columbia', 'Ontario', 'Alberta'],
    correct: 2,
    explanation: 'Ontario is the most populous province with approximately 14 million people, home to the country\'s largest city, Toronto.',
  },
  {
    id: 32,
    question: 'What is Canada\'s largest city?',
    choices: ['Ottawa', 'Vancouver', 'Montreal', 'Toronto'],
    correct: 3,
    explanation: 'Toronto is Canada\'s largest city with over 2.9 million people in the city proper and over 6 million in the greater metropolitan area.',
  },
  {
    id: 33,
    question: 'What is the name of Canada\'s national police force?',
    choices: ['Canadian Police Force', 'Royal Canadian Mounted Police (RCMP)', 'Ontario Provincial Police', 'Canadian Security Force'],
    correct: 1,
    explanation: 'The Royal Canadian Mounted Police (RCMP), also known as the Mounties, is Canada\'s national police force and a globally recognized Canadian symbol.',
  },
  {
    id: 34,
    question: 'What is Canada\'s national sport?',
    choices: ['Ice hockey only', 'Lacrosse only', 'Both ice hockey and lacrosse are official national sports', 'Curling'],
    correct: 2,
    explanation: 'Canada officially has two national sports: ice hockey (winter) and lacrosse (summer), both declared by Act of Parliament in 1994.',
  },
  {
    id: 35,
    question: 'Which ocean borders Canada on the east?',
    choices: ['Pacific Ocean', 'Arctic Ocean', 'Indian Ocean', 'Atlantic Ocean'],
    correct: 3,
    explanation: 'The Atlantic Ocean borders Canada on the east. Canada is bordered by three oceans: Atlantic (east), Pacific (west), and Arctic (north).',
  },

  // ── ECONOMY & REGIONS ──────────────────────────────────────
  {
    id: 36,
    question: 'What is Canada\'s economic system?',
    choices: ['Communist', 'Mixed market economy — combining free market with government regulation', 'Purely socialist', 'Barter-based'],
    correct: 1,
    explanation: 'Canada has a mixed market economy that combines elements of free enterprise with government regulation and social programs.',
  },
  {
    id: 37,
    question: 'Which region of Canada is known as the "bread basket" because of its grain production?',
    choices: ['British Columbia', 'Ontario and Quebec', 'The Prairie provinces — Manitoba, Saskatchewan, and Alberta', 'Atlantic Canada'],
    correct: 2,
    explanation: 'The Prairie provinces (Manitoba, Saskatchewan, and Alberta) are known for vast grain farms and are major world producers of wheat and canola.',
  },
  {
    id: 38,
    question: 'What is the significance of the St. Lawrence River to Canada?',
    choices: ['It is Canada\'s longest river', 'It was a major route for exploration, trade, and settlement — and still serves as a key shipping route', 'It forms Canada\'s border with the USA', 'It provides hydro power for most of Canada'],
    correct: 1,
    explanation: 'The St. Lawrence River was crucial to the exploration and settlement of Canada and remains one of the world\'s most important inland waterways for trade and shipping.',
  },
  {
    id: 39,
    question: 'What is NAFTA/CUSMA?',
    choices: ['Canada\'s national healthcare agreement', 'A free trade agreement between Canada, the United States, and Mexico', 'A military defence alliance', 'A Commonwealth trade agreement'],
    correct: 1,
    explanation: 'CUSMA (Canada-United States-Mexico Agreement), formerly NAFTA, is a free trade agreement that eliminated most tariffs between the three countries.',
  },
  {
    id: 40,
    question: 'What is the Canadian dollar symbol?',
    choices: ['CA', 'C$', '$', 'CAD$'],
    correct: 1,
    explanation: 'The Canadian dollar is symbolized as C$ (or CAD) to distinguish it from the US dollar. The coins include the loonie ($1) and toonie ($2).',
  },

  // ── CITIZENSHIP & IMMIGRATION ─────────────────────────────
  {
    id: 41,
    question: 'What are the rights exclusive to Canadian citizens (that permanent residents do not have)?',
    choices: ['The right to work in Canada', 'The right to vote in federal elections and run for elected office', 'The right to live in Canada', 'The right to education'],
    correct: 1,
    explanation: 'Only Canadian citizens have the right to vote in federal, provincial, and territorial elections and to run for elected office. Permanent residents have most other rights.',
  },
  {
    id: 42,
    question: 'What is the responsibility of every Canadian citizen regarding elections?',
    choices: ['Voting is mandatory — all citizens must vote', 'Voting is a right and a responsibility, though not legally mandatory', 'Only citizens over 25 must vote', 'Citizens can vote or delegate their vote to someone else'],
    correct: 1,
    explanation: 'Voting is a precious right and a civic responsibility in Canada, but it is not legally mandatory. Citizens are strongly encouraged to participate in democracy.',
  },
  {
    id: 43,
    question: 'How many years must a permanent resident live in Canada before applying for citizenship?',
    choices: ['2 out of 5 years', '3 out of 5 years', '4 out of 5 years', '5 out of 5 years'],
    correct: 1,
    explanation: 'Permanent residents must have lived in Canada for at least 3 out of the last 5 years (1,095 days) to be eligible to apply for citizenship.',
  },
  {
    id: 44,
    question: 'What document do you need to travel outside Canada as a Canadian citizen?',
    choices: ['A Canadian driver\'s licence', 'A Canadian passport', 'A citizenship certificate', 'A birth certificate'],
    correct: 1,
    explanation: 'A Canadian passport is required for international travel. It is also proof of citizenship and allows Canadians to receive consular assistance abroad.',
  },
  {
    id: 45,
    question: 'What is the Oath of Citizenship?',
    choices: ['A promise to pay Canadian taxes', 'A solemn promise to be loyal to Canada, obey its laws, and fulfill the duties of a citizen', 'A promise to learn both official languages', 'An agreement to live in Canada permanently'],
    correct: 1,
    explanation: 'The Oath of Citizenship is a solemn promise to be faithful and bear true allegiance to Canada and its King, and to uphold Canada\'s laws and fulfill a citizen\'s duties.',
  },

  // ── MILITARY & INTERNATIONAL ──────────────────────────────
  {
    id: 46,
    question: 'In which major wars did Canada participate in the 20th century?',
    choices: ['Only World War II', 'World War I, World War II, and the Korean War', 'Only the Korean War', 'World War I only'],
    correct: 1,
    explanation: 'Canada participated in World War I (1914-1918), World War II (1939-1945), and the Korean War (1950-1953), making significant sacrifices in each conflict.',
  },
  {
    id: 47,
    question: 'What is Remembrance Day in Canada?',
    choices: ['Canada Day celebrations', 'November 11 — the day Canadians remember those who died in wars serving Canada', 'A day to remember Confederation', 'Victoria Day celebrations'],
    correct: 1,
    explanation: 'Remembrance Day is November 11, when Canadians honour the men and women who have served and died for Canada in wars. The poppy is worn as a symbol of remembrance.',
  },
  {
    id: 48,
    question: 'What is Canada\'s role in international peacekeeping?',
    choices: ['Canada does not participate in international peacekeeping', 'Canada has a long tradition of contributing military and civilian personnel to UN peacekeeping missions worldwide', 'Canada only sends financial aid', 'Canada participates only in NATO operations'],
    correct: 1,
    explanation: 'Canada is known internationally for its peacekeeping contributions, sending military and civilian personnel to UN missions around the world since the 1950s.',
  },
  {
    id: 49,
    question: 'What is the Commonwealth of Nations?',
    choices: ['A military alliance led by Canada', 'An association of countries that were mostly part of the British Empire, promoting democracy and cooperation', 'A trade agreement between Canada and the UK', 'A United Nations committee'],
    correct: 1,
    explanation: 'The Commonwealth of Nations is an association of 56 countries, mostly former British territories, that cooperate on matters of democracy, development, and international peace.',
  },
  {
    id: 50,
    question: 'When did Canada gain full independence from Britain?',
    choices: ['1867', '1918', '1931 — the Statute of Westminster gave Canada legislative independence', '1982 — the Constitution Act'],
    correct: 2,
    explanation: 'The Statute of Westminster (1931) gave Canada and other Dominions full legislative independence. The Constitution Act (1982) brought the constitution fully under Canadian control.',
  },

  // ── CANADIAN VALUES & SOCIETY ────────────────────────────
  {
    id: 51,
    question: 'What does multiculturalism mean in Canada?',
    choices: ['Everyone must speak two languages', 'Canada encourages people to keep their cultural heritage while sharing in Canadian society and values', 'Only two cultures are officially recognized', 'Immigrants must abandon their culture to become Canadian'],
    correct: 1,
    explanation: 'Multiculturalism (official policy since 1971) means Canada values and celebrates cultural diversity. People are encouraged to maintain their heritage while participating in Canadian society.',
  },
  {
    id: 52,
    question: 'What is Canada Day and when is it celebrated?',
    choices: ['December 25 — celebrating the founding of Canada', 'July 1 — celebrating Confederation and Canada\'s birthday', 'November 11 — Remembrance Day', 'October 11 — Thanksgiving'],
    correct: 1,
    explanation: 'Canada Day is celebrated on July 1 each year to mark the anniversary of Confederation in 1867. It features parades, fireworks, and celebrations across the country.',
  },
  {
    id: 53,
    question: 'What is the significance of the poppy in Canada?',
    choices: ['It is Canada\'s national flower', 'It symbolizes remembrance for those who died in wars — worn especially around November 11', 'It represents Canadian agriculture', 'It is the emblem of the RCMP'],
    correct: 1,
    explanation: 'The red poppy is the symbol of Remembrance, inspired by the poem "In Flanders Fields." Canadians wear poppies in the weeks leading up to November 11.',
  },
  {
    id: 54,
    question: 'What does it mean that Canada is a "constitutional monarchy"?',
    choices: ['Canada is ruled by a King or Queen with absolute power', 'The King or Queen is head of state but power is exercised by elected representatives under a constitution', 'Canada has no written constitution', 'The Prime Minister is also the monarch'],
    correct: 1,
    explanation: 'In a constitutional monarchy, the King or Queen is the head of state but governs according to the constitution. Real political power rests with elected representatives.',
  },
  {
    id: 55,
    question: 'What are the official colours of Canada?',
    choices: ['Red and blue', 'Red and white', 'Blue and gold', 'Green and white'],
    correct: 1,
    explanation: 'Red and white are Canada\'s official colours, as declared by King George V in 1921. They appear on the Canadian flag and coat of arms.',
  },

  // ── ELECTIONS & VOTING ────────────────────────────────────
  {
    id: 56,
    question: 'At what age can Canadian citizens vote in federal elections?',
    choices: ['16 years old', '18 years old', '19 years old', '21 years old'],
    correct: 1,
    explanation: 'Canadian citizens who are 18 years of age or older on election day are entitled to vote in federal elections.',
  },
  {
    id: 57,
    question: 'What electoral system does Canada use for federal elections?',
    choices: ['Proportional representation', 'First-past-the-post — the candidate with the most votes in a riding wins', 'A two-round runoff system', 'A ranked ballot system'],
    correct: 1,
    explanation: 'Canada uses the first-past-the-post system where the candidate with the most votes in each riding wins the seat, regardless of whether they received a majority.',
  },
  {
    id: 58,
    question: 'Who runs federal elections in Canada?',
    choices: ['The Prime Minister\'s Office', 'Elections Canada — an independent, non-partisan agency', 'The Governor General', 'The Department of Justice'],
    correct: 1,
    explanation: 'Elections Canada is an independent, non-partisan agency of Parliament that administers federal elections and referendums.',
  },
  {
    id: 59,
    question: 'What is a majority government in Canada?',
    choices: ['When one party wins more than 50% of the popular vote', 'When one party wins more than half of the seats in the House of Commons', 'When the government wins a Senate vote', 'When the Prime Minister is re-elected'],
    correct: 1,
    explanation: 'A majority government occurs when one party holds more than half of the 338 seats in the House of Commons (170+ seats), allowing it to pass legislation without opposition support.',
  },
  {
    id: 60,
    question: 'What is a minority government in Canada?',
    choices: ['A government formed by a small political party', 'When the governing party holds fewer than half the seats and must work with other parties to pass legislation', 'A government with less than 100 seats', 'A government that only represents minority groups'],
    correct: 1,
    explanation: 'A minority government occurs when the governing party holds fewer than half the seats in the House of Commons. It must gain support from other parties to pass legislation.',
  },
];

// ── WHMIS 2015 Certification — 50 Questions ──────────────────
// Add to ALL_QUESTIONS in quiz/[testSlug]/page.jsx
// Change: 'whmis': GENERAL_QUESTIONS,
// To:     'whmis': WHMIS_QUESTIONS.slice(0, 5),

const WHMIS_QUESTIONS = [

  // ── WHAT IS WHMIS ─────────────────────────────────────────
  {
    id: 1,
    question: 'What does WHMIS stand for?',
    choices: ['Workplace Hazardous Materials Information System', 'Worker Health and Materials Inspection Standard', 'Workplace Hazard Management and Inspection System', 'Worker Hazardous Materials Identification Standard'],
    correct: 0,
    explanation: 'WHMIS stands for Workplace Hazardous Materials Information System. It is Canada\'s national standard for communicating hazard information about hazardous products used in the workplace.',
  },
  {
    id: 2,
    question: 'What is WHMIS 2015?',
    choices: ['A completely new system replacing the original WHMIS', 'An updated version of WHMIS that aligns Canada\'s system with the Globally Harmonized System (GHS) of Classification and Labelling', 'A US workplace safety system adopted by Canada', 'A new federal law replacing provincial safety laws'],
    correct: 1,
    explanation: 'WHMIS 2015 updated the original WHMIS 1988 to align with the Globally Harmonized System (GHS), making Canadian standards consistent with international hazard communication.',
  },
  {
    id: 3,
    question: 'What are the three key components of WHMIS?',
    choices: ['Labels, SDS, and Worker Education/Training', 'Labels, Permits, and Inspections', 'Training, Testing, and Certification', 'Warning Signs, Permits, and First Aid'],
    correct: 0,
    explanation: 'The three key components of WHMIS are: (1) Labels on hazardous products, (2) Safety Data Sheets (SDS) with detailed information, and (3) Worker education and training.',
  },
  {
    id: 4,
    question: 'Who is responsible for ensuring workers receive WHMIS training?',
    choices: ['Workers are responsible for training themselves', 'The government provides training directly to all workers', 'Employers are responsible for providing WHMIS education and training to workers', 'Suppliers are responsible for training all users of their products'],
    correct: 2,
    explanation: 'Employers are legally responsible for ensuring that workers who work with or near hazardous products receive appropriate WHMIS education and training.',
  },
  {
    id: 5,
    question: 'Which legislation governs WHMIS in federal workplaces?',
    choices: ['Canada Labour Code', 'Hazardous Products Act (HPA) and Hazardous Products Regulations (HPR)', 'Canada Occupational Safety Act', 'Workplace Safety and Insurance Act'],
    correct: 1,
    explanation: 'WHMIS in federal workplaces is governed by the Hazardous Products Act (HPA) and Hazardous Products Regulations (HPR), which set requirements for suppliers. Provinces have their own occupational health and safety laws for workplaces.',
  },

  // ── WHMIS CLASSES & HAZARD GROUPS ─────────────────────────
  {
    id: 6,
    question: 'What are the two main hazard groups in WHMIS 2015?',
    choices: ['Chemical hazards and biological hazards', 'Physical hazards and health hazards', 'Flammable hazards and toxic hazards', 'Immediate hazards and long-term hazards'],
    correct: 1,
    explanation: 'WHMIS 2015 organizes hazards into two main groups: Physical hazards (flammable, explosive, oxidizing, etc.) and Health hazards (toxic, carcinogenic, corrosive, etc.).',
  },
  {
    id: 7,
    question: 'Which of the following is a Physical Hazard class under WHMIS 2015?',
    choices: ['Reproductive toxicity', 'Flammable liquids', 'Carcinogenicity', 'Skin sensitization'],
    correct: 1,
    explanation: 'Flammable liquids are a Physical Hazard class. Physical hazards include flammable gases/liquids/solids, explosives, oxidizers, gases under pressure, and self-reactive substances.',
  },
  {
    id: 8,
    question: 'Which of the following is a Health Hazard class under WHMIS 2015?',
    choices: ['Explosives', 'Compressed gases', 'Carcinogenicity (cancer-causing)', 'Flammable aerosols'],
    correct: 2,
    explanation: 'Carcinogenicity is a Health Hazard class. Health hazards include acute toxicity, skin/eye irritation, respiratory sensitization, carcinogenicity, reproductive toxicity, and others.',
  },
  {
    id: 9,
    question: 'What does "acute toxicity" mean?',
    choices: ['Long-term health effects from repeated exposure', 'Harmful effects that occur after a single exposure or short-term exposure to a substance', 'A substance that causes cancer', 'A substance that corrodes metal'],
    correct: 1,
    explanation: 'Acute toxicity refers to harmful effects (injury or death) that occur after a single dose or short-term exposure to a hazardous substance.',
  },
  {
    id: 10,
    question: 'What is a "biohazardous infectious material" in WHMIS?',
    choices: ['A radioactive substance', 'An organism or toxin that can cause disease in people or animals', 'A chemical that causes burns', 'A material that reacts with water'],
    correct: 1,
    explanation: 'Biohazardous infectious materials include micro-organisms, nucleic acids, or proteins that can cause disease in humans or animals (e.g., bacteria, viruses, fungi, prions).',
  },

  // ── LABELS ────────────────────────────────────────────────
  {
    id: 11,
    question: 'What information must appear on a WHMIS 2015 supplier label?',
    choices: ['Product name only', 'Product identifier, hazard pictograms, signal word, hazard statements, precautionary statements, and supplier information', 'The SDS number and price', 'Only the signal word and supplier name'],
    correct: 1,
    explanation: 'A WHMIS 2015 supplier label must include: product identifier, hazard pictogram(s), signal word, hazard statement(s), precautionary statement(s), and supplier identification.',
  },
  {
    id: 12,
    question: 'What are the two signal words used on WHMIS 2015 labels?',
    choices: ['"Caution" and "Danger"', '"Warning" and "Danger"', '"Caution" and "Warning"', '"Hazard" and "Danger"'],
    correct: 1,
    explanation: '"Warning" and "Danger" are the two signal words. "Danger" indicates a more severe hazard, while "Warning" indicates a less severe hazard.',
  },
  {
    id: 13,
    question: 'What does the signal word "DANGER" on a label indicate?',
    choices: ['A minor hazard requiring basic caution', 'A more severe hazard — the most serious category of hazard', 'A biological hazard only', 'A transport hazard'],
    correct: 1,
    explanation: '"DANGER" is used for the more severe hazard categories. It indicates that the product poses a serious risk and extra precautions are required.',
  },
  {
    id: 14,
    question: 'What are "hazard statements" on a WHMIS label?',
    choices: ['Instructions for safe use', 'Standardized phrases that describe the nature of the hazard (e.g., "Highly flammable liquid and vapour")', 'The name of the chemical compound', 'First aid instructions'],
    correct: 1,
    explanation: 'Hazard statements are standardized phrases assigned to a hazard class that describe the nature and degree of hazard of a product (e.g., "Fatal if inhaled").',
  },
  {
    id: 15,
    question: 'What are "precautionary statements" on a WHMIS label?',
    choices: ['Descriptions of the hazard', 'Measures to minimize or prevent adverse effects — how to handle, store, dispose, and respond to exposure', 'The chemical formula of the product', 'Contact information for the supplier'],
    correct: 1,
    explanation: 'Precautionary statements describe recommended measures to minimize or prevent adverse effects from exposure, including prevention, response, storage, and disposal instructions.',
  },
  {
    id: 16,
    question: 'When must a workplace label be applied to a hazardous product?',
    choices: ['Never — supplier labels are always sufficient', 'When a product is transferred from its original container to another container in the workplace', 'Only when transporting products between departments', 'Only for products stored outdoors'],
    correct: 1,
    explanation: 'A workplace label is required when a hazardous product is transferred from its original container to another container, or when a supplier label is missing or unreadable.',
  },
  {
    id: 17,
    question: 'What is the minimum information required on a workplace label?',
    choices: ['Product name, hazard pictograms, and price', 'Product identifier (name), safe handling instructions, and reference to the SDS', 'Supplier name and expiry date only', 'Chemical formula and hazard class'],
    correct: 1,
    explanation: 'A workplace label must include: the product identifier (name), safe handling instructions, and a reference that an SDS is available (if the product has an SDS).',
  },

  // ── PICTOGRAMS ────────────────────────────────────────────
  {
    id: 18,
    question: 'What shape are WHMIS 2015 hazard pictograms?',
    choices: ['Circle', 'Square', 'Diamond (rotated square) with a red border', 'Triangle'],
    correct: 2,
    explanation: 'WHMIS 2015 pictograms are diamond-shaped (a square rotated 45°) with a red border and a white background, containing a black hazard symbol.',
  },
  {
    id: 19,
    question: 'What does the flame pictogram indicate?',
    choices: ['The product is corrosive', 'The product is flammable or combustible', 'The product is explosive', 'The product is an oxidizer'],
    correct: 1,
    explanation: 'The flame pictogram indicates that the product is flammable, combustible, self-reactive, pyrophoric, self-heating, emits flammable gas, or is an organic peroxide.',
  },
  {
    id: 20,
    question: 'What does the skull and crossbones pictogram mean?',
    choices: ['The product is a carcinogen', 'The product causes acute toxicity — it can be fatal or toxic if swallowed, inhaled, or absorbed through skin', 'The product is corrosive', 'The product is an oxidizer'],
    correct: 1,
    explanation: 'The skull and crossbones indicates acute toxicity — the product is toxic or fatal in small amounts if swallowed, inhaled, or absorbed through the skin.',
  },
  {
    id: 21,
    question: 'What does the health hazard pictogram (person with a starburst on chest) indicate?',
    choices: ['The product causes immediate skin burns', 'Serious long-term health effects such as carcinogenicity, reproductive toxicity, or respiratory sensitization', 'The product is explosive', 'The product emits harmful radiation'],
    correct: 1,
    explanation: 'The health hazard pictogram indicates serious long-term health effects including carcinogenicity (cancer), reproductive toxicity, respiratory sensitization, or specific target organ toxicity.',
  },
  {
    id: 22,
    question: 'What does the corrosion pictogram show?',
    choices: ['A product that reacts violently with water', 'A product that causes skin/eye burns and may corrode metals', 'A product that is flammable', 'A product that causes cancer'],
    correct: 1,
    explanation: 'The corrosion pictogram (showing damage to a surface and skin) indicates the product can cause severe skin burns, eye damage, or can corrode metals.',
  },
  {
    id: 23,
    question: 'What does the exclamation mark pictogram indicate?',
    choices: ['Extreme danger — fatal hazard', 'Less severe health hazards such as skin/eye irritation, harmful if inhaled, or skin sensitization', 'Explosive hazard', 'Environmental hazard'],
    correct: 1,
    explanation: 'The exclamation mark indicates less severe but still significant hazards such as skin or eye irritation, skin sensitization, harmful if swallowed or inhaled, or narcotic effects.',
  },
  {
    id: 24,
    question: 'What does the exploding bomb pictogram indicate?',
    choices: ['The product is flammable', 'The product is explosive or self-reactive with explosive potential', 'The product is toxic', 'The product is corrosive'],
    correct: 1,
    explanation: 'The exploding bomb pictogram indicates that the product is explosive, self-reactive with explosive properties, or an organic peroxide with explosive properties.',
  },
  {
    id: 25,
    question: 'What does the flame over circle pictogram indicate?',
    choices: ['Flammable product', 'Oxidizing product — can intensify fires by providing oxygen', 'Corrosive product', 'Explosive product'],
    correct: 1,
    explanation: 'The flame over circle (oxidizer symbol) indicates the product is an oxidizing gas, liquid, or solid that can intensify fires by releasing oxygen, even in the absence of air.',
  },

  // ── SAFETY DATA SHEETS (SDS) ──────────────────────────────
  {
    id: 26,
    question: 'What is a Safety Data Sheet (SDS)?',
    choices: ['A shipping document for hazardous materials', 'A document containing detailed information about a hazardous product including its hazards, safe handling, and emergency measures', 'A workplace inspection checklist', 'A training certificate for WHMIS'],
    correct: 1,
    explanation: 'An SDS (formerly called MSDS) is a standardized document that provides comprehensive information about a hazardous product including its composition, hazards, first aid, handling, storage, and disposal.',
  },
  {
    id: 27,
    question: 'How many sections does a WHMIS 2015 SDS contain?',
    choices: ['8 sections', '12 sections', '16 sections', '20 sections'],
    correct: 2,
    explanation: 'A WHMIS 2015 SDS must contain exactly 16 standardized sections, making it consistent with the internationally recognized GHS format.',
  },
  {
    id: 28,
    question: 'What information is found in Section 1 of an SDS?',
    choices: ['First aid measures', 'Identification — product name, recommended use, and supplier information', 'Physical and chemical properties', 'Exposure limits'],
    correct: 1,
    explanation: 'Section 1 of an SDS contains identification information: the product identifier (name), recommended uses, restrictions on use, and supplier contact information.',
  },
  {
    id: 29,
    question: 'What information is found in Section 8 of an SDS?',
    choices: ['Fire-fighting measures', 'Exposure controls and personal protective equipment (PPE)', 'Composition and ingredients', 'Disposal considerations'],
    correct: 1,
    explanation: 'Section 8 covers Exposure Controls/Personal Protection, including occupational exposure limits, engineering controls, and recommended PPE.',
  },
  {
    id: 30,
    question: 'Where must Safety Data Sheets be kept in a workplace?',
    choices: ['Only in the supervisor\'s office', 'In a location that is readily accessible to workers during their shift', 'Only in electronic format on the company server', 'At the main entrance of the building'],
    correct: 1,
    explanation: 'SDS must be readily accessible to workers at all times during their shift. They can be in paper or electronic format as long as workers can access them quickly.',
  },
  {
    id: 31,
    question: 'How long must suppliers update their SDS when significant new hazard information becomes available?',
    choices: ['Within 30 days', 'Within 60 days', '90 days', '180 days'],
    correct: 3,
    explanation: 'Suppliers must update their SDS within 180 days (6 months) of becoming aware of significant new information about the hazards of a product.',
  },
  {
    id: 32,
    question: 'What does Section 4 of an SDS cover?',
    choices: ['Fire-fighting measures', 'First aid measures — what to do if someone is exposed', 'Physical and chemical properties', 'Handling and storage'],
    correct: 1,
    explanation: 'Section 4 of an SDS covers First Aid Measures, describing what to do if someone is exposed to the product through inhalation, skin or eye contact, or ingestion.',
  },

  // ── SAFE HANDLING & PPE ───────────────────────────────────
  {
    id: 33,
    question: 'What does PPE stand for?',
    choices: ['Personal Protective Equipment', 'Professional Practice Evaluation', 'Personal Protection Enforcement', 'Product Packaging Equipment'],
    correct: 0,
    explanation: 'PPE stands for Personal Protective Equipment — protective clothing and equipment worn to minimize exposure to hazards (gloves, goggles, respirators, etc.).',
  },
  {
    id: 34,
    question: 'What is the hierarchy of hazard controls from most to least preferred?',
    choices: ['PPE → Administrative → Engineering → Substitution → Elimination', 'Elimination → Substitution → Engineering controls → Administrative controls → PPE', 'Training → PPE → Signs → Engineering → Elimination', 'Administration → PPE → Training → Engineering → Elimination'],
    correct: 1,
    explanation: 'The hierarchy of controls from most to least preferred: Elimination (remove hazard), Substitution (replace with safer), Engineering (isolate workers), Administrative (change work practices), PPE (last resort).',
  },
  {
    id: 35,
    question: 'When working with a flammable liquid, you should NOT:',
    choices: ['Read the SDS before starting', 'Use the flammable liquid near open flames or ignition sources', 'Wear appropriate PPE', 'Store it in an approved flammable storage cabinet'],
    correct: 1,
    explanation: 'Flammable liquids must be kept away from all ignition sources including open flames, sparks, hot surfaces, and static electricity, as they can easily catch fire or explode.',
  },
  {
    id: 36,
    question: 'What should you do if a hazardous product spills on your skin?',
    choices: ['Continue working and clean up later', 'Immediately rinse with large amounts of water for at least 15-20 minutes and follow SDS first aid instructions', 'Apply a neutralizing chemical immediately', 'Call the supervisor before doing anything'],
    correct: 1,
    explanation: 'For skin contact with a hazardous chemical, immediately flush with large amounts of water for at least 15-20 minutes. Follow the specific first aid instructions on the SDS.',
  },
  {
    id: 37,
    question: 'What is the purpose of an eyewash station in a workplace?',
    choices: ['For general hygiene and cleaning glasses', 'To immediately flush eyes with water following chemical exposure — required where eye injury is possible', 'For rinsing contaminated clothing', 'For emergency drinking water'],
    correct: 1,
    explanation: 'Eyewash stations provide immediate flushing of the eyes with water following chemical exposure. They must be accessible within 10 seconds of hazardous chemical areas.',
  },
  {
    id: 38,
    question: 'What does an occupational exposure limit (OEL) represent?',
    choices: ['The maximum amount of a chemical a factory can produce', 'The airborne concentration of a substance that most workers can be exposed to without adverse health effects', 'The legal fine for exceeding chemical limits', 'The minimum ventilation required in a workplace'],
    correct: 1,
    explanation: 'An OEL (also called TLV or TWA) is the concentration of an airborne substance that workers can typically be exposed to over a workday/week without experiencing adverse health effects.',
  },

  // ── STORAGE & DISPOSAL ────────────────────────────────────
  {
    id: 39,
    question: 'How should incompatible chemicals be stored?',
    choices: ['Together for convenience', 'Separately — incompatible chemicals can react dangerously if they contact each other', 'In the same room but on different shelves', 'Incompatibility only matters during transportation'],
    correct: 1,
    explanation: 'Incompatible chemicals must be stored separately. For example, acids and bases, oxidizers and flammables, or reactive metals and water must never be stored together as they can react violently.',
  },
  {
    id: 40,
    question: 'How should hazardous waste be disposed of in a workplace?',
    choices: ['Pour it down the drain if diluted enough', 'Throw it in the regular garbage', 'Following all applicable federal, provincial, and municipal regulations for hazardous waste disposal', 'Leave it for the cleaning staff'],
    correct: 2,
    explanation: 'Hazardous waste must be disposed of according to federal, provincial, and municipal environmental regulations. Section 13 of the SDS provides disposal guidance.',
  },
  {
    id: 41,
    question: 'Where should flammable liquids be stored?',
    choices: ['In standard metal cabinets', 'In approved flammable storage cabinets away from heat, ignition sources, and incompatible materials', 'In plastic containers in any cool area', 'Near fire exits for quick removal in emergencies'],
    correct: 1,
    explanation: 'Flammable liquids must be stored in approved flammable storage cabinets, away from ignition sources, heat, direct sunlight, and incompatible materials.',
  },

  // ── RIGHTS & RESPONSIBILITIES ─────────────────────────────
  {
    id: 42,
    question: 'What is a worker\'s right to know under WHMIS?',
    choices: ['Workers have the right to know how much chemicals cost', 'Workers have the right to information about the hazardous products they work with or near', 'Workers have the right to refuse to use any chemical', 'Workers have the right to choose their own PPE'],
    correct: 1,
    explanation: 'Under WHMIS and occupational health and safety laws, workers have the right to know about the hazards of products they work with — through labels, SDS, and training.',
  },
  {
    id: 43,
    question: 'Do workers have the right to refuse unsafe work in Canada?',
    choices: ['No — workers must follow employer instructions', 'Yes — workers have the right to refuse work they believe is dangerous to themselves or others', 'Only unionized workers have this right', 'Only if management agrees it is unsafe'],
    correct: 1,
    explanation: 'Canadian occupational health and safety laws give all workers the right to refuse work they reasonably believe is dangerous. This is a fundamental worker right.',
  },
  {
    id: 44,
    question: 'What are the three worker rights under occupational health and safety law in Canada?',
    choices: ['Right to work, right to safety equipment, right to training', 'Right to know, right to participate, right to refuse unsafe work', 'Right to compensation, right to training, right to supervision', 'Right to rest breaks, right to safety equipment, right to overtime pay'],
    correct: 1,
    explanation: 'The three fundamental worker rights are: (1) Right to Know about hazards, (2) Right to Participate in health and safety decisions, (3) Right to Refuse dangerous work.',
  },
  {
    id: 45,
    question: 'What is a worker\'s responsibility under WHMIS?',
    choices: ['To create their own SDS for products they use', 'To participate in training, follow safe work practices, use PPE, and report hazards', 'To purchase their own PPE', 'To write workplace safety policies'],
    correct: 1,
    explanation: 'Workers are responsible for: participating in WHMIS training, following safe work practices, using required PPE, and reporting hazards or problems to supervisors.',
  },

  // ── EMERGENCIES & FIRST AID ───────────────────────────────
  {
    id: 46,
    question: 'What should you do first if you suspect someone has been poisoned by a chemical?',
    choices: ['Induce vomiting immediately', 'Call Poison Control or 911 and consult the SDS for specific first aid instructions', 'Give them milk to neutralize the chemical', 'Have them walk around to keep them awake'],
    correct: 1,
    explanation: 'Call Poison Control (1-800-268-9017 in Ontario) or 911. Consult the SDS for specific first aid instructions — never induce vomiting unless specifically directed.',
  },
  {
    id: 47,
    question: 'What information does Section 5 of an SDS provide?',
    choices: ['First aid measures', 'Fire-fighting measures — how to extinguish fires involving the product', 'Handling and storage', 'Disposal methods'],
    correct: 1,
    explanation: 'Section 5 covers Fire-Fighting Measures, including which extinguishing media to use, special hazards from the burning substance, and protective equipment for firefighters.',
  },
  {
    id: 48,
    question: 'What should you do if you discover a chemical spill in your workplace?',
    choices: ['Clean it up yourself immediately regardless of the chemical', 'Alert others, evacuate if necessary, consult the SDS, and follow your workplace emergency response plan', 'Pour water on it immediately', 'Ignore small spills — only report large ones'],
    correct: 1,
    explanation: 'For a chemical spill: alert nearby workers, evacuate if the hazard warrants it, consult the SDS for spill procedures, and follow your workplace\'s emergency response plan. Never clean up a spill without knowing what the substance is.',
  },

  // ── REVIEW QUESTIONS ──────────────────────────────────────
  {
    id: 49,
    question: 'Which of the following products is NOT covered by WHMIS?',
    choices: ['Industrial cleaning solvents', 'Pesticides used in agriculture (regulated separately by the Pest Control Products Act)', 'Laboratory chemicals', 'Paint and coatings used in manufacturing'],
    correct: 1,
    explanation: 'Certain products are exempt from WHMIS, including pesticides (covered by the Pest Control Products Act), explosives (Explosives Act), cosmetics, drugs, and food.',
  },
  {
    id: 50,
    question: 'What is the best way to find out if a product you are using at work is hazardous?',
    choices: ['Judge by the smell — hazardous products always have a strong odour', 'Check the label and read the Safety Data Sheet (SDS) for the product', 'Ask a co-worker who has used it before', 'Assume all liquids are hazardous and all solids are safe'],
    correct: 1,
    explanation: 'Always check the label for hazard information and read the SDS for complete details. Never assume a product is safe because it has no smell — many hazardous substances are odourless.',
  },
];

// ── Food Handler Certificate — 50 Questions ──────────────────
// Add to ALL_QUESTIONS in quiz/[testSlug]/page.jsx
// Change: 'food-handler': FOOD_HANDLER_QUESTIONS,
// To:     'food-handler': FOOD_HANDLER_QUESTIONS_FULL.slice(0, 5),

const FOOD_HANDLER_QUESTIONS_FULL = [

  // ── TEMPERATURE CONTROL ───────────────────────────────────
  {
    id: 1,
    question: 'What is the temperature danger zone for food in Canada?',
    choices: ['0°C to 40°C', '4°C to 60°C', '10°C to 50°C', '0°C to 60°C'],
    correct: 1,
    explanation: 'The temperature danger zone is 4°C to 60°C (40°F to 140°F). Bacteria grow rapidly in this range. Keep cold food below 4°C and hot food above 60°C.',
  },
  {
    id: 2,
    question: 'What is the maximum time food can safely remain in the temperature danger zone?',
    choices: ['1 hour', '2 hours', '4 hours', '6 hours'],
    correct: 2,
    explanation: 'Food should not remain in the temperature danger zone (4°C to 60°C) for more than 2 hours total. After that, it should be discarded.',
  },
  {
    id: 3,
    question: 'What is the minimum safe internal temperature for cooking poultry (chicken, turkey)?',
    choices: ['63°C (145°F)', '71°C (160°F)', '74°C (165°F)', '82°C (180°F)'],
    correct: 2,
    explanation: 'Poultry must reach an internal temperature of 74°C (165°F) to kill harmful bacteria like Salmonella. Always use a food thermometer to verify.',
  },
  {
    id: 4,
    question: 'What is the minimum safe internal temperature for cooking ground meat (beef, pork)?',
    choices: ['63°C (145°F)', '71°C (160°F)', '74°C (165°F)', '82°C (180°F)'],
    correct: 1,
    explanation: 'Ground meat must reach 71°C (160°F) because grinding spreads bacteria throughout the meat. Whole cuts of beef can be served at lower temperatures.',
  },
  {
    id: 5,
    question: 'At what temperature must hot food be held during service?',
    choices: ['Above 55°C', 'Above 60°C', 'Above 65°C', 'Above 70°C'],
    correct: 1,
    explanation: 'Hot food must be held at 60°C (140°F) or above during service to prevent bacterial growth. Use steam tables, chafing dishes, or heat lamps.',
  },
  {
    id: 6,
    question: 'At what temperature must cold food be held during service?',
    choices: ['Below 8°C', 'Below 6°C', 'Below 4°C', 'Below 2°C'],
    correct: 2,
    explanation: 'Cold food must be held at 4°C (40°F) or below during service. Use ice, refrigeration units, or cold display equipment.',
  },
  {
    id: 7,
    question: 'What is the safe temperature for a refrigerator?',
    choices: ['0°C to 2°C', '0°C to 4°C', '4°C to 8°C', '0°C to 10°C'],
    correct: 1,
    explanation: 'Refrigerators should be kept at 0°C to 4°C (32°F to 40°F). Temperatures above 4°C allow bacteria to multiply rapidly.',
  },
  {
    id: 8,
    question: 'What is the safe temperature for a freezer?',
    choices: ['-5°C or below', '-10°C or below', '-18°C or below', '-25°C or below'],
    correct: 2,
    explanation: 'Freezers should be kept at -18°C (0°F) or below. At this temperature, bacteria cannot grow (though they are not killed — they become dormant).',
  },
  {
    id: 9,
    question: 'What is the minimum safe internal temperature for cooking fish and seafood?',
    choices: ['60°C (140°F)', '63°C (145°F)', '70°C (158°F)', '74°C (165°F)'],
    correct: 1,
    explanation: 'Fish and seafood must reach an internal temperature of 63°C (145°F). The flesh should be opaque and flake easily with a fork.',
  },
  {
    id: 10,
    question: 'How should you cool a large pot of hot soup or stew safely?',
    choices: ['Leave it on the counter overnight', 'Put it directly in the refrigerator while still very hot', 'Cool rapidly — divide into shallow containers and refrigerate within 2 hours, reaching 4°C within 6 hours total', 'Add ice directly to the food to cool it quickly'],
    correct: 2,
    explanation: 'Large quantities of hot food must be cooled rapidly. Divide into shallow containers (no more than 10 cm deep), and cool to 4°C within 6 hours (2 hours to reach 20°C, then 4 hours more to reach 4°C).',
  },

  // ── PERSONAL HYGIENE ──────────────────────────────────────
  {
    id: 11,
    question: 'How long should you wash your hands when working with food?',
    choices: ['5 seconds', '10 seconds', 'At least 20 seconds with soap and warm water', '1 minute'],
    correct: 2,
    explanation: 'Wash hands for at least 20 seconds with soap and warm water — this is enough time to effectively remove most harmful bacteria and viruses.',
  },
  {
    id: 12,
    question: 'When must food handlers wash their hands?',
    choices: ['Only before starting work', 'Before handling food, after using the washroom, after touching raw meat, after sneezing/coughing, after handling garbage', 'Only when hands look dirty', 'Only before serving customers'],
    correct: 1,
    explanation: 'Food handlers must wash hands: before starting work, before and after handling food, after using the washroom, after touching raw meat, after sneezing/coughing, after handling garbage, after touching their face or hair.',
  },
  {
    id: 13,
    question: 'Should a food handler work if they have symptoms of vomiting or diarrhea?',
    choices: ['Yes, if they feel well enough', 'Yes, if they wear gloves', 'No — they must stay home until symptom-free for at least 24-48 hours', 'Yes, if they avoid food preparation'],
    correct: 2,
    explanation: 'Food handlers with vomiting or diarrhea must NOT work with food. These symptoms indicate a highly contagious illness. They must be symptom-free for at least 24-48 hours before returning.',
  },
  {
    id: 14,
    question: 'What should a food handler do with a cut or wound on their hand?',
    choices: ['Continue working — small cuts are fine', 'Cover with a brightly coloured waterproof bandage AND wear a glove over it', 'Wash it and continue without covering', 'Go home immediately'],
    correct: 1,
    explanation: 'A cut must be covered with a brightly coloured (blue is best) waterproof bandage AND a glove worn over it. The colour makes it visible if the bandage falls into food.',
  },
  {
    id: 15,
    question: 'Are food handlers allowed to wear nail polish or false nails?',
    choices: ['Yes, any nail polish is acceptable', 'Yes, if they wear gloves', 'Generally no — nail polish can chip into food and false nails harbour bacteria', 'Only clear nail polish is acceptable'],
    correct: 2,
    explanation: 'Nail polish can chip into food and create a physical contamination hazard. False nails harbour bacteria underneath. Most food safety regulations prohibit both when handling food.',
  },
  {
    id: 16,
    question: 'What does "bare hand contact" mean and why should it be avoided?',
    choices: ['Using your hands without washing — always acceptable', 'Direct contact of bare hands with ready-to-eat food — should be avoided to prevent contamination', 'Using hands instead of utensils when food is clean', 'Handling food without thermometers'],
    correct: 1,
    explanation: 'Bare hand contact with ready-to-eat foods (foods that will not be cooked again) can transfer bacteria, viruses, and parasites directly to food. Use gloves, tongs, or utensils instead.',
  },

  // ── CROSS-CONTAMINATION ───────────────────────────────────
  {
    id: 17,
    question: 'What is cross-contamination?',
    choices: ['Mixing different types of cuisine', 'The transfer of harmful bacteria or allergens from one food or surface to another', 'Cooking food at the wrong temperature', 'Using expired ingredients'],
    correct: 1,
    explanation: 'Cross-contamination is the transfer of harmful bacteria, allergens, or other contaminants from one food, surface, or person to another. It is a leading cause of foodborne illness.',
  },
  {
    id: 18,
    question: 'What is the safest way to store raw meat in a refrigerator?',
    choices: ['On the top shelf above ready-to-eat foods', 'On the middle shelf', 'On the bottom shelf below all other foods, in a sealed container', 'It does not matter as long as it is wrapped'],
    correct: 2,
    explanation: 'Raw meat must be stored on the BOTTOM shelf to prevent drips from contaminating other foods. Store in sealed containers: raw poultry on the lowest shelf, then ground meat, then whole cuts above.',
  },
  {
    id: 19,
    question: 'What colour-coded cutting boards are typically used for raw poultry?',
    choices: ['Red', 'Yellow', 'Green', 'White'],
    correct: 1,
    explanation: 'Colour-coded cutting boards help prevent cross-contamination. Yellow is typically used for raw poultry. Red is for raw meat, green for produce, white for dairy/bread, blue for cooked foods.',
  },
  {
    id: 20,
    question: 'After cutting raw chicken on a cutting board, what must you do before cutting vegetables?',
    choices: ['Just rinse the board with water', 'Wipe with a paper towel', 'Wash and sanitize the cutting board and knife — or use a different board', 'Nothing — vegetables will be cooked anyway'],
    correct: 2,
    explanation: 'The cutting board and knife must be washed with hot soapy water, rinsed, and sanitized (or a different board used) before cutting vegetables to prevent cross-contamination from raw chicken.',
  },
  {
    id: 21,
    question: 'What is the difference between cleaning and sanitizing?',
    choices: ['They are the same thing', 'Cleaning removes visible dirt; sanitizing reduces micro-organisms to safe levels — both steps are necessary', 'Sanitizing is done before cleaning', 'Only one step is needed for food contact surfaces'],
    correct: 1,
    explanation: 'Cleaning removes visible dirt, food residue, and grease. Sanitizing reduces micro-organisms (bacteria, viruses) to safe levels. Both steps are required for food contact surfaces.',
  },

  // ── FOODBORNE ILLNESS ─────────────────────────────────────
  {
    id: 22,
    question: 'What are the most common causes of foodborne illness?',
    choices: ['Spoiled food only', 'Poor temperature control, cross-contamination, poor personal hygiene, and using contaminated equipment', 'Eating too much food', 'Natural food toxins only'],
    correct: 1,
    explanation: 'The most common causes of foodborne illness are: improper temperature control, cross-contamination, poor personal hygiene, using contaminated equipment, and using food from unsafe sources.',
  },
  {
    id: 23,
    question: 'Which bacteria is commonly associated with undercooked poultry and eggs?',
    choices: ['E. coli', 'Salmonella', 'Listeria', 'Norovirus'],
    correct: 1,
    explanation: 'Salmonella is commonly found in raw poultry, eggs, and sometimes produce. It causes symptoms including diarrhea, fever, and abdominal cramps. Proper cooking destroys it.',
  },
  {
    id: 24,
    question: 'Which pathogen is most commonly associated with undercooked ground beef?',
    choices: ['Salmonella', 'Listeria', 'E. coli O157:H7', 'Norovirus'],
    correct: 2,
    explanation: 'E. coli O157:H7 is commonly linked to undercooked ground beef. It can cause severe illness including bloody diarrhea and kidney failure (hemolytic uremic syndrome).',
  },
  {
    id: 25,
    question: 'What is Norovirus and how is it commonly spread?',
    choices: ['A bacteria found in raw meat', 'A highly contagious virus spread through contaminated food, water, and person-to-person contact — a leading cause of foodborne illness', 'A parasite found in seafood only', 'A toxin produced by mold'],
    correct: 1,
    explanation: 'Norovirus is a highly contagious virus and the most common cause of gastroenteritis. Infected food handlers are a major source — proper handwashing is critical.',
  },
  {
    id: 26,
    question: 'What is Listeria and who is most at risk?',
    choices: ['A common cold virus', 'A bacteria found in ready-to-eat foods like deli meats — high risk for pregnant women, elderly, and immunocompromised people', 'A toxin from mushrooms', 'A parasite from raw fish'],
    correct: 1,
    explanation: 'Listeria monocytogenes is a bacteria that can grow at refrigerator temperatures. It is found in deli meats, soft cheeses, and smoked fish. Especially dangerous for pregnant women and immunocompromised individuals.',
  },

  // ── FOOD STORAGE & FIFO ───────────────────────────────────
  {
    id: 27,
    question: 'What does FIFO stand for in food storage?',
    choices: ['First In, First Out', 'Food In, Food Out', 'Fresh Items First Out', 'First Inspection, Final Output'],
    correct: 0,
    explanation: 'FIFO stands for First In, First Out. Older products are used before newer ones. New deliveries go behind existing stock so oldest product is used first.',
  },
  {
    id: 28,
    question: 'How should you thaw frozen food safely?',
    choices: ['On the counter at room temperature', 'In hot water', 'In the refrigerator, under cold running water, or in the microwave (if cooking immediately)', 'In a warm oven set to 100°C'],
    correct: 2,
    explanation: 'Safe thawing methods: in the refrigerator (best), under cold running water, or in the microwave if cooking immediately. Never thaw at room temperature — this puts food in the danger zone.',
  },
  {
    id: 29,
    question: 'Can you refreeze food that has been thawed?',
    choices: ['Yes, always', 'No, never', 'Yes, if it was thawed in the refrigerator and has not been in the danger zone too long', 'Only if it looks and smells fine'],
    correct: 2,
    explanation: 'Food thawed safely in the refrigerator can generally be refrozen, though quality may suffer. Food thawed by other methods should be cooked before refreezing.',
  },
  {
    id: 30,
    question: 'How should dry goods (flour, sugar, rice) be stored?',
    choices: ['In their original paper bags on the floor', 'In sealed, labelled, food-grade containers off the floor and away from walls', 'Next to cleaning chemicals for convenience', 'In any available space'],
    correct: 1,
    explanation: 'Dry goods should be stored in sealed, food-grade containers with labels showing product name and date. Store at least 15 cm off the floor and 15 cm away from walls for air circulation and pest prevention.',
  },

  // ── ALLERGENS ────────────────────────────────────────────
  {
    id: 31,
    question: 'What are the major food allergens in Canada that must be declared on labels?',
    choices: ['Only peanuts and tree nuts', 'Peanuts, tree nuts, milk, eggs, wheat, soy, sesame, seafood (fish, crustaceans, shellfish), mustard, and sulphites', 'Only the top 3 most common allergens', 'Gluten and dairy only'],
    correct: 1,
    explanation: 'Health Canada identifies 14 priority food allergens that must be declared: peanuts, tree nuts, milk, eggs, wheat, soy, sesame, fish, crustaceans, shellfish, mustard, sulphites, and others.',
  },
  {
    id: 32,
    question: 'What should a food handler do when a customer says they have a food allergy?',
    choices: ['Assure them the food is safe without checking', 'Take it seriously — check ingredients, avoid cross-contamination, and involve management if unsure', 'Tell them to order something else', 'Just remove the allergen from the dish and serve it'],
    correct: 1,
    explanation: 'Food allergies can be life-threatening. Take all allergy requests seriously. Check all ingredients, prevent cross-contamination, use clean equipment, and involve a supervisor if uncertain.',
  },
  {
    id: 33,
    question: 'What is anaphylaxis?',
    choices: ['Mild food intolerance', 'A severe, potentially life-threatening allergic reaction requiring immediate epinephrine (EpiPen) and emergency medical care', 'A type of food poisoning', 'Chronic stomach upset from food sensitivity'],
    correct: 1,
    explanation: 'Anaphylaxis is a severe allergic reaction that can cause throat swelling, difficulty breathing, and death within minutes. It requires immediate use of an epinephrine auto-injector (EpiPen) and a call to 911.',
  },

  // ── PEST CONTROL & FACILITY ───────────────────────────────
  {
    id: 34,
    question: 'What are signs of a pest infestation in a food facility?',
    choices: ['Clean floors and organized storage', 'Droppings, gnaw marks, nesting materials, live or dead pests, and damaged packaging', 'Strong cleaning chemical odours', 'Increased food spoilage only'],
    correct: 1,
    explanation: 'Signs of pests include: droppings or urine stains, gnaw marks on food or packaging, nesting materials, live or dead insects/rodents, and damaged food packaging.',
  },
  {
    id: 35,
    question: 'How should garbage be managed in a food facility?',
    choices: ['Leave garbage bins open for easy access', 'Empty garbage regularly, use covered containers, keep away from food preparation areas, and clean bins frequently', 'Garbage management is not a food safety concern', 'Only remove garbage at end of day'],
    correct: 1,
    explanation: 'Proper garbage management prevents pests and contamination: use covered containers, empty frequently, keep away from food areas, clean and sanitize bins regularly, and ensure outdoor containers have tight-fitting lids.',
  },
  {
    id: 36,
    question: 'What is the minimum distance food should be stored off the floor?',
    choices: ['5 cm', '10 cm', '15 cm', '30 cm'],
    correct: 2,
    explanation: 'Food must be stored at least 15 cm (6 inches) off the floor. This allows for cleaning, air circulation, and prevents pest access to food.',
  },

  // ── RECEIVING & INSPECTION ────────────────────────────────
  {
    id: 37,
    question: 'At what temperature should fresh meat and poultry be received?',
    choices: ['Below 10°C', 'Below 6°C', 'Below 4°C or colder', 'Below 0°C'],
    correct: 2,
    explanation: 'Fresh meat and poultry should be received at 4°C or below. Reject any product received above this temperature as it may have been in the danger zone too long.',
  },
  {
    id: 38,
    question: 'What should you do if a food delivery arrives in damaged packaging?',
    choices: ['Accept it — packaging damage does not affect food safety', 'Inspect carefully and reject items where packaging damage may have compromised food safety', 'Accept if the price is reduced', 'Use damaged items first'],
    correct: 1,
    explanation: 'Damaged packaging can indicate mishandling, contamination, or temperature abuse. Reject items where packaging damage (swollen cans, broken seals, contaminated packaging) may have compromised food safety.',
  },
  {
    id: 39,
    question: 'What does a swollen or bulging can indicate?',
    choices: ['The can is very fresh', 'Possible botulism contamination — never open or use a swollen can', 'The can was overfilled — safe to use', 'The product may taste different but is still safe'],
    correct: 1,
    explanation: 'A swollen or bulging can is a serious danger sign indicating possible Clostridium botulinum (botulism) growth. NEVER open or use — discard carefully or return to supplier.',
  },

  // ── CLEANING & SANITIZING ────────────────────────────────
  {
    id: 40,
    question: 'What is the correct order for cleaning and sanitizing a food contact surface?',
    choices: ['Sanitize, then clean, then rinse', 'Clean, rinse, sanitize, allow to air dry', 'Sanitize, rinse, clean, dry', 'Clean and sanitize at the same time'],
    correct: 1,
    explanation: 'The correct sequence is: (1) Scrape/remove food debris, (2) Clean with detergent and hot water, (3) Rinse with clean water, (4) Sanitize, (5) Allow to air dry — never towel dry as this can re-contaminate.',
  },
  {
    id: 41,
    question: 'What is the minimum concentration of bleach (chlorine) solution for sanitizing food contact surfaces?',
    choices: ['10 ppm', '100 ppm', '200 ppm', '1000 ppm'],
    correct: 1,
    explanation: 'A chlorine bleach solution of 100 ppm (approximately 1 tablespoon of bleach per 4 litres of water) is the standard sanitizing concentration for food contact surfaces.',
  },
  {
    id: 42,
    question: 'How often should food contact surfaces be cleaned and sanitized?',
    choices: ['Once daily at closing', 'After each use, when switching between raw and ready-to-eat foods, and at least every 4 hours during continuous use', 'Once per week', 'Only when visibly dirty'],
    correct: 1,
    explanation: 'Food contact surfaces must be cleaned and sanitized: after each use, when switching between raw and ready-to-eat foods, after any contamination, and at minimum every 4 hours during continuous use.',
  },

  // ── FOOD HANDLER CERTIFICATION ────────────────────────────
  {
    id: 43,
    question: 'Who is required to have food handler certification in Ontario?',
    choices: ['Only restaurant owners', 'Food handlers working in food premises — at least one certified person must be present during all hours of operation', 'Only kitchen managers', 'All employees including servers and cashiers must be individually certified'],
    correct: 1,
    explanation: 'In Ontario, food premises must have at least one certified food handler present during all hours of operation. Many provinces have similar requirements.',
  },
  {
    id: 44,
    question: 'How long is a food handler certificate typically valid in Ontario?',
    choices: ['1 year', '3 years', '5 years', '10 years'],
    correct: 2,
    explanation: 'Food handler certificates in Ontario are valid for 5 years. After expiry, recertification is required to maintain the credential.',
  },
  {
    id: 45,
    question: 'What is the purpose of a Hazard Analysis Critical Control Point (HACCP) system?',
    choices: ['A system for tracking food costs', 'A systematic approach to identifying and controlling food safety hazards before they cause illness', 'A certification for food handlers', 'A government inspection system'],
    correct: 1,
    explanation: 'HACCP is a science-based food safety management system that identifies, evaluates, and controls significant food safety hazards at Critical Control Points throughout the food handling process.',
  },

  // ── PHYSICAL & CHEMICAL CONTAMINATION ─────────────────────
  {
    id: 46,
    question: 'What is physical contamination of food?',
    choices: ['Bacterial contamination', 'Foreign objects in food such as glass, metal, bone, plastic, or personal items like jewellery', 'Chemical contamination', 'Allergen contamination'],
    correct: 1,
    explanation: 'Physical contamination occurs when foreign objects enter food — glass shards, metal fragments, bone pieces, plastic, hair, staples, or jewellery. These can cause injury when eaten.',
  },
  {
    id: 47,
    question: 'What is chemical contamination of food?',
    choices: ['Bacteria in food', 'When harmful chemicals such as cleaning agents, pesticides, or toxic metals get into food', 'Physical objects in food', 'Allergens in food'],
    correct: 1,
    explanation: 'Chemical contamination occurs when harmful chemicals enter food — cleaning products, sanitizers, pesticides, lubricants, or heavy metals like lead. Always store chemicals separately from food.',
  },
  {
    id: 48,
    question: 'To prevent chemical contamination, cleaning products should be stored:',
    choices: ['On shelves above food items', 'Next to food for convenience', 'In a separate, designated area away from food and food contact surfaces', 'In the refrigerator to keep them fresh'],
    correct: 2,
    explanation: 'Cleaning chemicals must be stored in a separate, designated area — never above, beside, or near food or food contact surfaces. Clearly label all chemical containers.',
  },

  // ── REVIEW ───────────────────────────────────────────────
  {
    id: 49,
    question: 'What is the "2-hour/4-hour rule" in food safety?',
    choices: ['Food must be cooked for 2 hours minimum', 'Food in the danger zone under 2 hours can be used; 2-4 hours must be used immediately; over 4 hours must be discarded', 'Food must be refrigerated every 2 hours and frozen every 4 hours', 'Hand washing must occur every 2 to 4 hours'],
    correct: 1,
    explanation: 'The 2-hour/4-hour rule: if food has been in the danger zone for less than 2 hours it can be used or refrigerated; 2-4 hours it should be used immediately; over 4 hours it must be discarded.',
  },
  {
    id: 50,
    question: 'What is the single most effective way a food handler can prevent foodborne illness?',
    choices: ['Wearing gloves at all times', 'Frequent and proper handwashing with soap and water', 'Cooking all food thoroughly', 'Keeping the kitchen very clean'],
    correct: 1,
    explanation: 'Frequent and thorough handwashing with soap and warm water for at least 20 seconds is the single most effective measure to prevent the spread of foodborne illness.',
  },
];

// ── BC ICBC Knowledge Test — 40 Questions ────────────────────
const BC_QUESTIONS = [
  { id:1,  question:'What is the speed limit in a school zone in British Columbia?', choices:['30 km/h','40 km/h','50 km/h','60 km/h'], correct:1, explanation:'The speed limit in a BC school zone is 40 km/h when children are present (8 am to 5 pm on school days).' },
  { id:2,  question:'What is the default speed limit on BC highways unless posted otherwise?', choices:['80 km/h','90 km/h','100 km/h','110 km/h'], correct:2, explanation:'The default speed limit on BC highways is 100 km/h unless a lower limit is posted.' },
  { id:3,  question:'What is the default speed limit in a municipality (city or town) in BC?', choices:['30 km/h','50 km/h','60 km/h','70 km/h'], correct:1, explanation:'The default speed limit within municipalities in BC is 50 km/h unless posted otherwise.' },
  { id:4,  question:'In BC, what is the blood alcohol limit for a fully licensed driver before facing criminal charges?', choices:['0.05%','0.08%','0.10%','0.00%'], correct:1, explanation:'The criminal blood alcohol limit in BC is 0.08%. However, at 0.05% you face an immediate roadside prohibition (IRP).' },
  { id:5,  question:'What blood alcohol level triggers an Immediate Roadside Prohibition (IRP) in BC?', choices:['0.00%','0.03%','0.05%','0.08%'], correct:2, explanation:'In BC, a reading of 0.05% blood alcohol triggers a 3-day Immediate Roadside Prohibition even though it is below the criminal limit.' },
  { id:6,  question:'What is the Graduated Licensing Program (GLP) in BC?', choices:['A program for seniors to renew licences','A two-stage system (L and N) for new drivers with restrictions before a full licence','A commercial driving program','An advanced driving course'], correct:1, explanation:'BC\'s GLP has two stages: the L (Learner) stage and the N (Novice) stage. Both have restrictions. After 24 months with N, you qualify for a full licence.' },
  { id:7,  question:'What does the N on a red background mean on a vehicle in BC?', choices:['The driver is new to the area','The driver holds a Novice (N) licence with restrictions','The vehicle is rented','The driver is a night worker'], correct:1, explanation:'The red N sign indicates a Novice driver. They must display this sign and follow specific restrictions including passenger limits and zero blood alcohol.' },
  { id:8,  question:'An L (Learner) driver in BC must be accompanied by:', choices:['Any licensed driver','A fully licensed driver who has held their licence for at least 2 years, sitting in the front passenger seat','A driving instructor only','Anyone in the vehicle'], correct:1, explanation:'An L driver must be accompanied by a supervisor with a valid Class 5 or higher licence held for at least 2 years, seated in the front passenger seat.' },
  { id:9,  question:'What is the blood alcohol limit for an L or N driver in BC?', choices:['0.05%','0.08%','0.00% — zero tolerance','0.03%'], correct:2, explanation:'L and N drivers must have zero blood alcohol. Any amount of alcohol results in immediate roadside prohibition.' },
  { id:10, question:'When must you signal before turning or changing lanes in BC?', choices:['Only on highways','At least 30 metres (100 feet) before turning or changing lanes','Only when other cars are present','Only at intersections with traffic lights'], correct:1, explanation:'In BC you must signal at least 30 metres (approximately 100 feet) before turning, changing lanes, or pulling away from the curb.' },
  { id:11, question:'What does a flashing green light mean in BC?', choices:['Proceed with caution','You are at a pedestrian-controlled intersection — pedestrians may activate the signal to stop traffic','The light is about to turn yellow','Yield to pedestrians only'], correct:1, explanation:'In BC, a flashing green light means the intersection is pedestrian-controlled. A pedestrian can press a button to change the light to red.' },
  { id:12, question:'When must you yield to a pedestrian in BC?', choices:['Only at marked crosswalks','At all crosswalks — marked or unmarked — and any intersection corner','Only when a pedestrian steps off the curb','Only when a pedestrian is in your lane'], correct:1, explanation:'In BC you must yield to pedestrians at all crosswalks, whether marked or unmarked (any intersection corner). Failing to yield is a serious offence.' },
  { id:13, question:'What must you do when you see a stopped school bus with flashing red lights in BC?', choices:['Slow to 20 km/h','Stop from both directions on undivided roads — wait until lights stop flashing','Only stop if you are behind the bus','Only stop if children are visible'], correct:1, explanation:'You must stop on undivided roads from both directions when a school bus has flashing red lights. Wait until the lights stop and the stop arm retracts.' },
  { id:14, question:'How far must you park from a fire hydrant in BC?', choices:['1 metre','3 metres','5 metres','6 metres'], correct:2, explanation:'In BC you must not park within 5 metres of a fire hydrant.' },
  { id:15, question:'What is the maximum speed in an alley in BC?', choices:['20 km/h','30 km/h','40 km/h','50 km/h'], correct:0, explanation:'The maximum speed limit in alleys in BC is 20 km/h.' },
  { id:16, question:'In BC, when can you turn right on a red light?', choices:['Never','After coming to a complete stop and yielding to pedestrians and traffic, unless a sign prohibits it','Anytime without stopping if no traffic is coming','Only between 7 pm and 7 am'], correct:1, explanation:'You may turn right on a red light after a complete stop and yielding — unless a NO RIGHT TURN ON RED sign is posted.' },
  { id:17, question:'What is the safe following distance in BC under normal conditions?', choices:['1 second','2 seconds','3 seconds','4 seconds'], correct:1, explanation:'BC recommends a minimum 2-second following distance under normal conditions. Increase to 4 or more seconds in poor weather.' },
  { id:18, question:'In BC, what does a single solid yellow centre line on your side mean?', choices:['You may pass when safe','No passing from your side of the road','Passing zone begins','Construction zone ahead'], correct:1, explanation:'A solid yellow centre line on your side means no passing from your side. You must not cross this line to pass.' },
  { id:19, question:'When approaching an uncontrolled intersection in BC, who has the right of way?', choices:['The driver on the left','The driver who arrived first, then the driver on the right','The driver going straight','The driver on the larger road'], correct:1, explanation:'At uncontrolled intersections: the driver who arrives first has right of way. If arriving at the same time, yield to the driver on your right.' },
  { id:20, question:'What must you do before entering a traffic circle (roundabout) in BC?', choices:['Stop and wait for all traffic to clear','Yield to traffic already in the circle — enter when safe','You have right of way when entering','Speed up to merge with circulating traffic'], correct:1, explanation:'Yield to all traffic already circulating in the roundabout. Enter only when there is a safe gap.' },
  { id:21, question:'In BC, using a hand-held cell phone while driving carries:', choices:['A warning for first offence','A fine and 4 penalty points on your driving record','Only a fine, no points','Just a verbal warning from police'], correct:1, explanation:'Using a hand-held device while driving in BC results in a fine and 4 penalty points. Repeat offences within 3 years result in much higher fines.' },
  { id:22, question:'What is the Move Over law in BC?', choices:['A rule about lane changes on highways','You must slow down and move over when passing stopped emergency vehicles, tow trucks, and highway maintenance vehicles with flashing lights','A rule about yielding to merging traffic','A requirement to move right on multi-lane roads'], correct:1, explanation:'BC\'s Move Over law requires drivers to slow down and move to another lane when passing any stopped vehicle with flashing lights on the roadside.' },
  { id:23, question:'In BC, when must you use your headlights?', choices:['Only at night','From 30 minutes after sunset to 30 minutes before sunrise, and whenever visibility is poor','Only in rain and snow','Only on highways'], correct:1, explanation:'BC requires headlights from 30 minutes after sunset to 30 minutes before sunrise, and whenever weather or visibility requires them.' },
  { id:24, question:'What should you do if your vehicle starts to skid in BC?', choices:['Brake hard and turn into the skid','Ease off the gas, steer in the direction you want to go, and brake gently if needed','Steer away from the skid direction','Press the clutch and brake at the same time'], correct:1, explanation:'Ease off the gas and steer in the direction you want the front of the car to go. Avoid hard braking which worsens the skid.' },
  { id:25, question:'What is the fine for speeding in a school zone in BC?', choices:['Same as normal speeding fine','Double the normal fine plus points','Triple the normal fine','A flat $500 fine'], correct:1, explanation:'Speeding fines in school zones and construction zones in BC are doubled, and penalty points still apply.' },
  { id:26, question:'In BC, when is it legal to make a U-turn?', choices:['Anywhere on a two-lane road','Where you can be clearly seen by other drivers and there is no sign prohibiting it','Only in residential areas','Never on a public road'], correct:1, explanation:'U-turns are permitted where you have a clear view of traffic in both directions and where no sign prohibits it. They are prohibited at intersections with traffic lights.' },
  { id:27, question:'What is the minimum age to apply for an L (Learner\'s) licence in BC?', choices:['14 years old','15 years old','16 years old','17 years old'], correct:1, explanation:'You must be at least 16 years old to apply for an L (Learner\'s) licence in BC.' },
  { id:28, question:'In BC, how long must you hold your L (Learner\'s) licence before you can take the road test for N?', choices:['6 months','12 months','18 months','24 months'], correct:1, explanation:'You must hold your L licence for at least 12 months before taking the road test to get your N (Novice) licence.' },
  { id:29, question:'What is the passenger restriction for a new N (Novice) driver in BC?', choices:['No passengers allowed','One passenger only for the first 12 months (unless family members)','Two passengers maximum','No restriction on passengers'], correct:1, explanation:'For the first 12 months with an N licence, you may carry only one passenger (unless all passengers are immediate family members). After 12 months, more passengers are allowed.' },
  { id:30, question:'In BC, where must cyclists ride on a road?', choices:['In the centre of the lane','As far right as is safe and practicable','On the sidewalk','In the left lane'], correct:1, explanation:'Cyclists must ride as far right as is safe and practicable on the road. They may take the full lane when necessary for safety.' },
  { id:31, question:'What distance must you give a cyclist when passing in BC?', choices:['0.5 metres','1 metre','1.5 metres','2 metres'], correct:2, explanation:'BC law requires at least 1 metre of clearance when passing a cyclist at speeds up to 50 km/h, and 1.5 metres at higher speeds.' },
  { id:32, question:'In BC, when is a driver required to carry a set of emergency flares or reflective triangles?', choices:['Always','Only for commercial vehicles','Never — only motorcycles need them','Only in winter months'], correct:1, explanation:'Commercial vehicles in BC are required to carry emergency warning devices. Regular passenger vehicles are not legally required to carry them but it is strongly recommended.' },
  { id:33, question:'What should you do if a driver behind you is tailgating in BC?', choices:['Brake suddenly to teach them a lesson','Gradually slow down and increase your following distance ahead to allow more stopping room','Speed up','Move to the left lane'], correct:1, explanation:'Increase following distance ahead so you can stop more gradually, reducing the risk of a rear-end collision if you need to stop.' },
  { id:34, question:'When is it legal to pass on the right in BC?', choices:['Never','When the vehicle ahead is turning left and there is a clear lane to the right','Anytime on a multi-lane road','Only on highways'], correct:1, explanation:'You may pass on the right only when the vehicle ahead is making a left turn and there is sufficient room to the right. Do not drive off the paved road surface to pass.' },
  { id:35, question:'In BC, what does a white diamond painted on the road indicate?', choices:['A pedestrian crossing ahead','A reserved lane for high-occupancy vehicles or cyclists','A no-passing zone','A school crossing'], correct:1, explanation:'White diamonds mark reserved lanes such as HOV (High Occupancy Vehicle) or bicycle lanes.' },
  { id:36, question:'What must you do when an emergency vehicle with lights and sirens is approaching from behind in BC?', choices:['Speed up to get out of the way','Pull to the right side of the road and stop until it passes','Continue at the same speed','Pull to the left side of the road'], correct:1, explanation:'Pull to the right side of the road and stop. Wait until the emergency vehicle has completely passed before continuing.' },
  { id:37, question:'In BC, what is the maximum speed allowed in a playground zone?', choices:['20 km/h','30 km/h','40 km/h','50 km/h'], correct:1, explanation:'The maximum speed in a playground zone in BC is 30 km/h. These zones are marked by flashing amber lights during specified hours.' },
  { id:38, question:'What does a steady yellow light mean in BC?', choices:['Speed up to get through the intersection','The light is about to turn red — stop if you can do so safely','Yield to pedestrians only','You have right of way'], correct:1, explanation:'A yellow light means the signal is about to change to red. Stop if you can do so safely. Do not speed up to beat the light.' },
  { id:39, question:'In BC, how many demerit points before a driving prohibition is issued to a new driver (N)?', choices:['8 points','6 points','4 points','10 points'], correct:1, explanation:'A Novice (N) driver in BC faces a 6-month driving prohibition after accumulating 6 or more points within 12 months.' },
  { id:40, question:'What is the required stopping distance from a school bus with flashing red lights when on a divided highway in BC?', choices:['You must stop from both directions','Vehicles on the opposite side of a physical barrier do not need to stop','Only school buses in your direction need stopping for','You must stop only if the bus door is open'], correct:1, explanation:'On a divided highway with a physical barrier, vehicles on the opposite side do NOT need to stop. Only vehicles following behind the bus must stop.' },
];

// ── Ontario G1 General Rules ──────────────────────────────────
const GENERAL_QUESTIONS = [
  { id:1,  question:'What is the maximum speed limit on Ontario highways unless otherwise posted?', choices:['110 km/h','100 km/h','90 km/h','120 km/h'], correct:1, explanation:'The default maximum on Ontario highways is 100 km/h unless a posted sign says otherwise.' },
  { id:2,  question:'How far before a turn must you signal in a residential area?', choices:['15 metres','50 metres','30 metres','100 metres'], correct:2, explanation:'Signal at least 30 metres before turning in a residential or business area.' },
  { id:3,  question:'What must you do when you reach a STOP sign?', choices:['Slow down and check for traffic','Stop only if pedestrians are present','Come to a complete stop before the stop line','Yield to vehicles on your right'], correct:2, explanation:'You must make a complete stop before the stop line, crosswalk, or the edge of the intersection.' },
  { id:4,  question:'What is the speed limit in a school zone in Ontario?', choices:['50 km/h','60 km/h','40 km/h','30 km/h'], correct:2, explanation:'The maximum speed in a school zone is 40 km/h when children are present.' },
  { id:5,  question:'When must you stop for a school bus with flashing red lights on an undivided road?', choices:['Only if children are visible','Only during school hours','Always — from both directions','Only if approaching from the front'], correct:2, explanation:'On an undivided road, all vehicles from both directions must stop when a school bus has flashing red lights.' },
  { id:6,  question:'What is the legal blood alcohol limit for a G1 or G2 driver?', choices:['0.05%','0.08%','0.00% — zero tolerance','0.03%'], correct:2, explanation:'Novice drivers (G1 and G2) must have zero blood alcohol. Any alcohol is a violation.' },
  { id:7,  question:'What is the minimum following distance on a highway?', choices:['1 second','2 seconds','3 seconds','4 seconds'], correct:1, explanation:'The minimum following distance is 2 seconds. Increase to 4+ seconds in poor weather.' },
  { id:8,  question:'When should you use low-beam headlights in fog?', choices:['Always use high beams','Use low beams — high beams reflect off fog','Use hazard lights only','No lights needed in daytime'], correct:1, explanation:'Use low beams in fog. High beams reflect off fog particles and reduce your visibility.' },
  { id:9,  question:'A G1 driver must be accompanied by a licensed driver with at least how many years of experience?', choices:['2 years','3 years','4 years','5 years'], correct:2, explanation:'A G1 driver must be accompanied by a fully licensed driver with at least 4 years of experience.' },
  { id:10, question:'What does a flashing green light mean at an intersection?', choices:['Proceed with caution — light about to change','You have an advance green — go straight, turn left or right','Only left-turning vehicles may proceed','Speed up before the light changes'], correct:1, explanation:'A flashing green means you have the right of way to proceed in any direction.' },
];

// ── Canadian Citizenship ──────────────────────────────────────
const CITIZENSHIP_QUESTIONS = [
  { id:1, question:'What is the capital city of Canada?', choices:['Toronto','Vancouver','Ottawa','Montreal'], correct:2, explanation:'Ottawa, Ontario is the capital city of Canada.' },
  { id:2, question:'Who is the head of state of Canada?', choices:['The Prime Minister','The President','The King or Queen of Canada','The Governor General'], correct:2, explanation:'The King or Queen of Canada (represented by the Governor General) is the head of state.' },
  { id:3, question:'What are the three levels of government in Canada?', choices:['Federal, Provincial, and Municipal','National, Regional, and Local','Senate, House, and Courts','Crown, Parliament, and Cabinet'], correct:0, explanation:'Canada has three levels: Federal (national), Provincial/Territorial, and Municipal (local).' },
  { id:4, question:'How many provinces does Canada have?', choices:['8','10','12','13'], correct:1, explanation:'Canada has 10 provinces and 3 territories, for a total of 13.' },
  { id:5, question:"What is the name of Canada's national anthem?", choices:['The Maple Leaf Forever','God Save the King','O Canada','True North'], correct:2, explanation:"O Canada is the national anthem, officially adopted in 1980." },
];

// ── Food Handler ──────────────────────────────────────────────
const FOOD_HANDLER_QUESTIONS = [
  { id:1, question:'What is the minimum internal temperature for cooking poultry?', choices:['63°C (145°F)','71°C (160°F)','74°C (165°F)','82°C (180°F)'], correct:2, explanation:'Poultry must reach an internal temperature of 74°C (165°F) to be safe to eat.' },
  { id:2, question:'What is the temperature danger zone for food?', choices:['0°C to 40°C','4°C to 60°C','10°C to 50°C','0°C to 60°C'], correct:1, explanation:'The danger zone is 4°C to 60°C where bacteria grow rapidly.' },
  { id:3, question:'How long should you wash your hands before handling food?', choices:['5 seconds','10 seconds','20 seconds','30 seconds'], correct:2, explanation:'Wash hands for at least 20 seconds with soap and water.' },
  { id:4, question:'How long can hot food safely sit at room temperature?', choices:['30 minutes','1 hour','2 hours','4 hours'], correct:2, explanation:'Hot food should not sit at room temperature for more than 2 hours.' },
  { id:5, question:'What does FIFO stand for in food storage?', choices:['First In, First Out','Food In, Food Out','Fresh In, Fresh Out','First Inspection, Final Out'], correct:0, explanation:'FIFO means First In, First Out — older products should be used before newer ones.' },
];

// ── Question routing ──────────────────────────────────────────
const ALL_QUESTIONS = {
  'ontario-g1':       GENERAL_QUESTIONS,
  'ontario-g1-signs': SIGNS_QUESTIONS.slice(0, 5),
  'ontario-m1':       M1_QUESTIONS.slice(0, 5),
  'ontario-az':       AZ_QUESTIONS.slice(0, 5),
  'bc-knowledge':     BC_QUESTIONS.slice(0, 5),
  'alberta-class5':   ALBERTA_QUESTIONS.slice(0, 5),
  'citizenship':      CITIZENSHIP_QUESTIONS_FULL.slice(0, 5),
  'food-handler':     FOOD_HANDLER_QUESTIONS_FULL.slice(0, 5),
  'whmis':            WHMIS_QUESTIONS.slice(0, 5),
};

const TEST_NAMES = {
  'ontario-g1':       'Ontario G1 — General Rules',
  'ontario-g1-signs': 'Ontario G1 — Road Signs',
  'ontario-m1':       'Ontario M1 Motorcycle Test',
  'ontario-az':       'Ontario AZ Truck Licence',
  'bc-knowledge':     'BC ICBC Knowledge Test',
  'alberta-class5':   'Alberta Class 5 Knowledge',
  'citizenship':      'Canadian Citizenship Test',
  'food-handler':     'Food Handler Certificate',
  'whmis':            'WHMIS 2015 Certification',
};

const HEADER_COLORS = {
  'ontario-g1':       '#1E3A5F',
  'ontario-g1-signs': '#DC2626',
  'ontario-m1':       '#7C3AED',
  'ontario-az':       '#B45309',
  'bc-knowledge':     '#065F46',
  'alberta-class5':   '#92400E',
  'citizenship':      '#DC2626',
  'food-handler':     '#D97706',
  'whmis':            '#DC2626',
};

export default function QuizPage() {
  const params   = useParams();
  const router   = useRouter();
  const testSlug = params.testSlug;

  const testName    = TEST_NAMES[testSlug]  || 'Practice Test';
  const headerColor = HEADER_COLORS[testSlug] || '#1E3A5F';
  const isSigns     = testSlug === 'ontario-g1-signs';

  // ── ALL state declarations first ──────────────────────────
  const [current,      setCurrent]     = useState(0);
  const [selected,     setSelected]    = useState(null);
  const [confirmed,    setConfirmed]   = useState(false);
  const [answers,      setAnswers]     = useState([]);
  const [finished,     setFinished]    = useState(false);
  const [timeLeft,     setTimeLeft]    = useState(300);
  const [isPurchased,  setIsPurchased] = useState(false);

  useEffect(() => {
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    setIsPurchased(purchases.includes(testSlug));
  }, [testSlug]);

  // ── THEN questions (now isPurchased exists) ───────────────
  const allFull = {
    'ontario-g1':       GENERAL_QUESTIONS,
    'ontario-g1-signs': SIGNS_QUESTIONS,
    'ontario-m1':       M1_QUESTIONS,
    'ontario-az':       AZ_QUESTIONS,
    'bc-knowledge':     BC_QUESTIONS,
    'alberta-class5':   ALBERTA_QUESTIONS,
    'citizenship':      CITIZENSHIP_QUESTIONS_FULL,
    'food-handler':     FOOD_HANDLER_QUESTIONS_FULL,
    'whmis':            WHMIS_QUESTIONS,
  };
  const questions = isPurchased
    ? (allFull[testSlug] || GENERAL_QUESTIONS)
    : (ALL_QUESTIONS[testSlug] || GENERAL_QUESTIONS);


  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setFinished(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!finished) return;
    const score = answers.filter(a => a.isCorrect).length;
    const total = questions.length;
    router.push(
      '/results?test=' + testSlug +
      '&score=' + score +
      '&total=' + total +
      '&name=' + encodeURIComponent(testName)
    );
  }, [finished]);

  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, '0');
  const q    = questions[current];

  const confirmAnswer = () => {
    if (selected === null) return;
    const isCorrect = selected === q.correct;
    setAnswers(prev => [...prev, { id: q.id, selected, correct: q.correct, isCorrect }]);
    setConfirmed(true);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      clearInterval(timerRef.current);
      setFinished(true);
    } else {
      setCurrent(i => i + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const getChoiceStyle = (index) => {
    const base = {
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
      border: '2px solid', marginBottom: '10px', fontSize: '0.95rem',
    };
    if (!confirmed) {
      return index === selected
        ? { ...base, background: '#DBEAFE', borderColor: '#3B82F6', color: '#1E40AF' }
        : { ...base, background: '#F9FAFB', borderColor: '#E5E7EB', color: '#374151' };
    }
    if (index === q.correct) return { ...base, background: '#DCFCE7', borderColor: '#16A34A', color: '#15803D' };
    if (index === selected)  return { ...base, background: '#FEE2E2', borderColor: '#DC2626', color: '#B91C1C' };
    return { ...base, background: '#F9FAFB', borderColor: '#E5E7EB', color: '#9CA3AF' };
  };

  const getBadgeColor = (index) => {
    if (confirmed && index === q.correct) return '#16A34A';
    if (confirmed && index === selected)  return '#DC2626';
    if (index === selected)               return '#2563EB';
    return '#E5E7EB';
  };

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#F8FAFF' }}>

      {/* Top bar */}
      <div style={{
        background: headerColor, color: 'white', padding: '12px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Link href="/tests" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Tests
        </Link>
        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{testName}</span>
        <span style={{ fontWeight: '700', color: timeLeft < 60 ? '#FCA5A5' : '#93C5FD' }}>
          ⏱ {mins}:{secs}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#E5E7EB', height: '6px' }}>
        <div style={{ background: headerColor, height: '100%', width: progress + '%', transition: 'width 0.3s' }} />
      </div>

      {/* Counter */}
    <div style={{ textAlign: 'center', padding: '16px 20px 0', color: '#6B7280', fontSize: '0.9rem' }}>
        Question {current + 1} of {questions.length}
        <span style={{
          marginLeft: '12px',
          background: isPurchased ? '#DCFCE7' : '#FEF9C3',
          color: isPurchased ? '#15803D' : '#92400E',
          padding: '2px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600'
        }}>
          {isPurchased ? '✓ FULL ACCESS' : 'FREE TRIAL'}
        </span>
      </div>  {/* ← ADD THIS */}

      {/* Question card */}
      <div style={{ maxWidth: '680px',  margin: '20px auto', padding: '0 20px' }}>
        <div style={{
          background: 'white', borderRadius: '16px', padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>

          {/* Sign image — only for signs test */}
          {isSigns && q.image && (
            <div style={{
              display: 'flex', justifyContent: 'center', background: '#F9FAFB',
              borderRadius: '12px', padding: '20px', marginBottom: '20px',
              border: '1px solid #E5E7EB'
            }}>
              <img src={q.image} alt="Road sign"
                style={{ width: '180px', height: '180px', objectFit: 'contain' }} />
            </div>
          )}

          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#111827', lineHeight: 1.6, marginBottom: '20px' }}>
            {q.question}
          </h2>

          {q.choices.map((choice, index) => (
            <div key={index} style={getChoiceStyle(index)} onClick={() => !confirmed && setSelected(index)}>
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: getBadgeColor(index), color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '0.85rem', flexShrink: 0
              }}>
                {LABELS[index]}
              </span>
              {choice}
            </div>
          ))}

          {confirmed && (
            <div style={{
              marginTop: '16px', padding: '14px 16px', borderRadius: '10px',
              background: '#FEF9C3', borderLeft: '4px solid #EAB308',
              display: 'flex', gap: '10px', alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{selected === q.correct ? '✅' : '❌'}</span>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#713F12', lineHeight: 1.6 }}>
                {q.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Action button */}
        <div style={{ marginTop: '16px' }}>
          {!confirmed ? (
            <button onClick={confirmAnswer} disabled={selected === null} style={{
              width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
              cursor: selected === null ? 'not-allowed' : 'pointer',
              background: selected === null ? '#93C5FD' : headerColor,
              color: 'white', fontWeight: '700', fontSize: '1rem'
            }}>
              Confirm Answer
            </button>
          ) : (
            <button onClick={nextQuestion} style={{
              width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
              cursor: 'pointer', background: '#16A34A', color: 'white',
              fontWeight: '700', fontSize: '1rem'
            }}>
              {current + 1 === questions.length ? 'See Results →' : 'Next Question →'}
            </button>
          )}
        </div>

       {/* Upgrade banner — only shown when not purchased */}
        {!isPurchased && (
        <div style={{
          marginTop: '24px', background: headerColor, borderRadius: '12px',
          padding: '20px', textAlign: 'center', color: 'white', marginBottom: '32px'
        }}>
          <p style={{ margin: '0 0 4px', fontWeight: '700' }}>
            🔒 Free trial — {questions.length} questions only
          </p>
          <p style={{ margin: '0 0 14px', opacity: 0.8, fontSize: '0.9rem' }}>
            {isSigns
              ? 'Unlock all 62 Ontario road sign questions with images for just $7.99 CAD'
              : testSlug === 'ontario-m1'
              ? 'Unlock all 60 M1 motorcycle questions for just $7.99 CAD'
              : 'Unlock 200+ questions, progress tracking and exam simulation'}
          </p>
          <Link href="/pricing" style={{
            background: '#F0C040', color: '#1E3A5F', padding: '10px 28px',
            borderRadius: '8px', fontWeight: '800', textDecoration: 'none', fontSize: '0.95rem'
          }}>
            Unlock Full Access — $7.99 CAD →
          </Link>
        </div>
        )}
      </div>
    </div>
  );
}