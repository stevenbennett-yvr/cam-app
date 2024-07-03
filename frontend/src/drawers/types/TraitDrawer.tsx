import { drawerState } from "@atoms/navAtoms";
import { Timeline, Group, Box, Title, Accordion, Text, TypographyStylesProvider, HoverCard, Kbd } from "@mantine/core";
import { IconBadgesFilled, IconBlockquote, IconFrame, IconMathSymbols, IconTimeline } from "@tabler/icons-react";
import { toLabel } from "@utils/to-label";
import { Variable } from "@typing/variables";
import { getVariable } from "@variables/variable-manager";

export function TraitDrawerTitle(props: { data: { variableName: string; } }) {

    return (
        <>
            {props.data.variableName && (
                <Group justify="space-between" wrap='nowrap'>
                    <Group wrap="nowrap" gap={10}>
                        <Box>
                            <Title order={3}>{toLabel(props.data.variableName)}</Title>
                        </Box>
                    </Group>
                    <Box>
                        Dots
                    </Box>
                </Group>
            )}
        </>
    )
}

export function TraitDrawerContent(props: {
    data: { variableName: string; };
    onMetadataChange?: (openedDict?: Record<string, string>) => void;
}) {

    const trait = getVariable<Variable>('CHARACTER', props.data.variableName)
    const timeline: any[] = []

    return (
        <Box>
            <Accordion variant='separated' defaultValue=''>
                <Accordion.Item value="description">
                    <Accordion.Control icon={<IconBlockquote size={'1rem'} />}>
                        Description
                    </Accordion.Control>
                    <Accordion.Panel>
                        <TypographyStylesProvider fz={'sm'}>
                            <div
                                dangerouslySetInnerHTML={{ __html: getTraitDescription(props.data.variableName) }}
                            />
                        </TypographyStylesProvider>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value='breakdown'>
                    <Accordion.Control icon={<IconMathSymbols size='1rem' />} >Breakdown</Accordion.Control>
                    <Accordion.Panel>
                        <Group gap={8} px={10}>
                            + 0 =
                            <HoverCard shadow="md" openDelay={250} width={230} position="bottom" zIndex={10000} withArrow>
                                <HoverCard.Target>
                                    <Kbd style={{ cursor: 'pointer' }}>0</Kbd>
                                </HoverCard.Target>
                                <HoverCard.Dropdown py={5} px={10}>
                                    <Text c='gray.0' size="xs">
                                        You have 0 Creation Points invested into this trait.
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                            +
                            <HoverCard shadow="md" openDelay={250} width={230} position="bottom" zIndex={10000} withArrow>
                                <HoverCard.Target>
                                    <Kbd style={{ cursor: 'pointer' }}>0</Kbd>
                                </HoverCard.Target>
                                <HoverCard.Dropdown py={5} px={10}>
                                    <Text c='gray.0' size="xs">
                                        Experience gives you 0 points in this trait.
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                            +
                            <HoverCard shadow="md" openDelay={250} width={230} position="bottom" zIndex={10000} withArrow>
                                <HoverCard.Target>
                                    <Kbd style={{ cursor: 'pointer' }}>0</Kbd>
                                </HoverCard.Target>
                                <HoverCard.Dropdown py={5} px={10}>
                                    <Text c='gray.0' size="xs">
                                        Other Bonus
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </Group>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="timeline">
                    <Accordion.Control icon={<IconTimeline size='1rem' />}>Timeline</Accordion.Control>
                    <Accordion.Panel>
                        <Box>
                            <Timeline active={timeline.length - 1} bulletSize={24} lineWidth={2}>
                                {timeline.map((item, index) => (
                                    <Timeline.Item
                                        bullet={item.type === 'ADJUSTMENT' ? <IconBadgesFilled size={12} /> : <IconFrame size={12} />}
                                        title={item.title}
                                        key={index}
                                    >
                                        <Text size='xs' fs='italic' mt={4}>
                                            {item.description}
                                        </Text>
                                    </Timeline.Item>
                                ))}
                                {timeline.length === 0 && (
                                    <Text fz='sm' fs='italic'>
                                        No recorded history found for this proficiency.
                                    </Text>
                                )}
                            </Timeline>
                        </Box>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Box>
    )
}

function getTraitDescription(traitname: string) {

    // ATTRIBUTES
    if (traitname.toLowerCase() === 'strength') {
        return `
        <p>How much you can lift, how far you can jump, how much force you can bring to bear... These matters of physical power are measured by Strength. The rough amount you can deadlift without an Attribute test appears in parentheses below. Characters who frequently use Brawl, Melee, Potence, and Protean will find Strength useful.</p>

        <ul>
            <li>• You can easily lift a child. (20 kg/44 lbs)</li>
            <li>•• You are physically average. (45 kg/99 lbs)</li>
            <li>••• You can lift a large person or similar-sized objects without difficulty. (115 kg/253 lbs)</li>
            <li>•••• You are remarkably strong, able to move things solo that would usually require a team. (180 kg/396 lbs)</li>
            <li>••••• Your strength is incredible, like the greatest of mortal body builders. (250 kg/550 lbs)</li>
        </ul>
        `
    }
    if (traitname.toLowerCase() === 'dexterity') {
        return `
        <p>Your grace, agility, and speed are governed by Dexterity. Dodging a punch, picking a 
        lock or doing brain surgery without slicing the cerebellum are all examples of things governed by 
        this Attribute. Characters who want to avoid hits, engage in ranged combat, or use the Celerity 
        Discipline should consider having high Dexterity.</p>

        <ul>
            <li>• You have poor balance and agility.</li>
            <li>•• You can be fast on occasion.</li>
            <li>••• You are coordinated and quick.</li>
            <li>•••• You are naturally acrobatic and can move with incredible grace.</li>
            <li>••••• You are more graceful than the best of dancers and more agile than an Olympic gymnast.</li>
        </ul>
        `
    }
    if (traitname.toLowerCase() === 'dexterity') {
        return `
        <p>Your grace, agility, and speed are governed by Dexterity. Dodging a punch, picking a 
        lock or doing brain surgery without slicing the cerebellum are all examples of things governed by 
        this Attribute. Characters who want to avoid hits, engage in ranged combat, or use the Celerity 
        Discipline should consider having high Dexterity.</p>

        <ul>
            <li>• You have poor balance and agility.</li>
            <li>•• You can be fast on occasion.</li>
            <li>••• You are coordinated and quick.</li>
            <li>•••• You are naturally acrobatic and can move with incredible grace.</li>
            <li>••••• You are more graceful than the best of dancers and more agile than an Olympic gymnast.</li>
        </ul>
        `
    }
    if (traitname.toLowerCase() === 'stamina') {
        return `
        <p>Toughness, resilience and resistance to harm are the province of Stamina. The number 
        of Health levels your character has is equal to your Stamina + 3.</p>

        <ul>
            <li>• You are easily winded and have little tolerance for pain.</li>
            <li>•• You can take a few hits and go for a long hike.</li>
            <li>••• You are fit and hearty.</li>
            <li>•••• Your personal resilience is impressive, like the finest of Special Forces soldiers or marathon runners.</li>
            <li>••••• You are incredibly difficult to hurt, with nearly supernatural levels of tolerance for injury.</li>
        </ul>
        `
    }
    if (traitname.toLowerCase() === 'charisma') {
        return `
<p>Allure, social graces, and personal presence are governed by Charisma. Those who 
have it find their lives–and feeding–easier; those who do not have it find that people are not drawn 
to them. Note that Charisma does not depend solely (or at all) on appearance. A character who is 
stunning might lack any sort of charm, while an average-looking character might have incredible 
magnetism. Characters who wish to use the Dominate, Presence and Animalism Disciplines may 
find Charisma helpful.</p>

<ul>
    <li>• You are unremarkable and struggle to connect.</li>
    <li>•• You are generally likable, though you are not someone who would draw people in a crowd.</li>
    <li>••• You are easily trusted and make friends without difficulty.</li>
    <li>•••• You are magnetic and alluring.</li>
    <li>••••• You are a paragon of social magnetism. People want to know you.</li>
</ul>
        `
    }
    if (traitname.toLowerCase() === 'manipulation') {
        return `
<p>Manipulation is the ability to change another’s perspective, lie convincingly, or 
otherwise socially maneuver another person in the direction you wish. Manipulation is useful for 
characters who wish to use the Dominate, Presence, and Animalism Disciplines.</p>

<ul>
    <li>• You can convince people if you remain honest.</li>
    <li>•• You can deceive people sometimes, if they are not particularly astute.</li>
    <li>••• You are a capable negotiator.</li>
    <li>•••• You could be a politician or argue in front of a jury.</li>
    <li>••••• You are incredibly adept at getting what you want.</li>
</ul>
        `
    }
    if (traitname.toLowerCase() === 'composure') {
        return `
<p>Composure governs keeping calm, cool and collected, whether in the face of danger, during a tense negotiation, or in the face of great terror. Your Composure + Resolve equals 
your Willpower. Composure comes up often in tests to resist supernatural disciplines.</p>

<ul>
    <li>• You are easily angered by minor frustrations.</li>
    <li>•• You can keep it cool in most situations, but unexpected occurrences raise your hackles.</li>
    <li>••• When chaos breaks out, people look to you to guide them.</li>
    <li>•••• You have a remarkable poker face and a good handle on your Beast.</li>
    <li>••••• You are a rock in stormy seas, a paragon of keeping it together.</li>
</ul>
        `
    }
    if (traitname.toLowerCase() === 'intelligence') {
        return `
<p>Intelligence governs your capacity to learn, analyze, and assess information. A 
character with high Intelligence might be educated or a natural genius. Characters who use the 
Auspex, Obfuscate, and Blood Sorcery Disciplines will find Intelligence helpful.</p>

<ul>
    <li>• You can read and write, but you struggle with deep analysis.</li>
    <li>•• You are of average intelligence, but rarely have anything groundbreaking to say.</li>
    <li>••• You have a keen mind, with the ability to connect difficult concepts and clues.</li>
    <li>•••• You have a brilliant mind. Others may seek your thoughts on all manner of subjects.</li>
    <li>••••• Genius like yours comes about only rarely.</li>
</ul>
        `
    }
    if (traitname.toLowerCase() === 'intelligence') {
        return `
<p>Intelligence governs your capacity to learn, analyze, and assess information. A 
character with high Intelligence might be educated or a natural genius. Characters who use the 
Auspex, Obfuscate, and Blood Sorcery Disciplines will find Intelligence helpful.</p>

<ul>
    <li>• You can read and write, but you struggle with deep analysis.</li>
    <li>•• You are of average intelligence, but rarely have anything groundbreaking to say.</li>
    <li>••• You have a keen mind, with the ability to connect difficult concepts and clues.</li>
    <li>•••• You have a brilliant mind. Others may seek your thoughts on all manner of subjects.</li>
    <li>••••• Genius like yours comes about only rarely.</li>
</ul>
        `
    }
    if (traitname.toLowerCase() === 'wits') {
        return `
<p>Quick thinking, working on the fly, and instincts are governed by Wits. A character who 
has high Wits is perceptive and intuitive, with the ability to pick up on subtleties. High Wits is 
useful for augmenting various Auspex, Obfuscate and Blood Sorcery powers.</p>

<ul>
    <li>• It takes you time and explanation to grasp subtleties, but you can do it with effort.</li>
    <li>•• You have a reasonable reaction time and can rely on your gut more often than not.</li>
    <li>••• You have strong intuition and can quickly devise solutions, even under pressure.</li>
    <li>•••• You catch subtleties easily and are very difficult to ambush.</li>
    <li>••••• You have exceptional instincts, and you react incredibly fast to danger.</li>
</ul>
        `
    }
    if (traitname.toLowerCase() === 'resolve') {
        return `
<p>A character’s force of will, mental fortitude and drive is measured by their Resolve. 
Remaining on task for a long period of time and shutting out distractions rely on this Attribute. 
Resolve can also help resist supernatural Disciplines.</p>

<ul>
    <li>• You are easily distracted, though you can focus on important things.</li>
    <li>•• You can pull an all-nighter on a task once in a while, but you would not make a habit of it.</li>
    <li>••• You are focused. People would say you have a good work ethic.</li>
    <li>•••• Knocking you off the course you set for yourself is very difficult.</li>
    <li>••••• Very few people can match your focus, drive, and ambition.</li>
</ul>
        `
    }


    // SKILLS
    if (traitname.toLowerCase() === 'athletics') {
        return `
<p>Athletics lets you attempt things such as outrun a police officer, dodge a punch from 
an angry mobster, swim a raging river, or scale the side of a building.</p>

<p><b>Example Uses:</b> <i>Getting out of the way of a gunshot requires a Dexterity + Athletics challenge 
contested by Dexterity + Marksmanship. Running a foot chase requires a contested Stamina + 
Athletics test. Climbing a building requires a Strength + Athletics test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'brawl') {
        return `
<p>Brawl is the Skill that relates to unarmed combat. Any attack that does not have a weapon 
in hand uses Brawl; this Skill covers all unarmed combat from grappling to Taekwondo.</p>
        `
    }
    if (traitname.toLowerCase() === 'craft') {
        return `
<p>The Craft Skill covers any form of artistry that involves creating objects. Beautiful penmanship, crafting a fine sword, restoring a car, or putting together a bear trap to protect your Haven are all Crafts checks. For each dot of Crafts you possess, you may choose a particular specialty that represents a type of crafting you create with particular expertise. When using the Crafts Skill to create something with your specialty, you gain +1 to your pool.</p>

<p>For example, if you have 2 dots in Crafts with the specialties “painting” and “tailoring,” and you are sewing a new shirt, your pool would be your Dexterity + 2 for your two dots in Crafts +1 for your specialty in tailoring. You may only gain a single +1 bonus to your Crafts pool, regardless of the number of specialties that may apply to the challenge.</p>

<p><b>Example Uses:</b> <i>Restoring a car in a downtime action requires a Dexterity + Crafts static challenge. Forging a sword on an anvil requires a Strength + Crafts static challenge. Creating a hidden bear trap to catch your opponent requires an Intelligence + Crafts vs. your opponent’s Wits + Larceny.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'driving') {
        return `
<p>Except, possibly, for the oldest of vampires, almost anyone can drive a car if they learn to do so. The Driving Skill governs the ability to do so safely in dangerous or difficult conditions. Driving in regular traffic does not require a Driving test, but steering successfully away from an ambush or winning a race would.</p>

<p><b>Example Uses:</b> <i>Subtly tailing another vehicle requires an opposed Wits + Driving test. Losing a pursuing vehicle requires opposed Dexterity + Driving tests. Ramming another vampire with a vehicle requires a Dexterity + Driving test vs. their Dexterity + Athletics.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'marksmanship') {
        return `
<p>Swords and supernaturally-empowered punches are not common in today’s world. Shooting a gun, on the other hand, is often dismissed as unremarkable, a sad bit of alltoo-common violence in the World of Darkness. This Skill is used for any form of ranged combat involving a weapon, from thrown weapons such as a dart, to pistols and assault rifles, to crossbows and longbows.</p>
        `
    }
    if (traitname.toLowerCase() === 'larceny') {
        return `
<p>Also called "Security" by vampires who prefer to cast a more positive light on their activities, this Skill represents the physical tricks of the trade of criminals and the people who counter them. Whether you want to crack a safe, forge a passport, hot-wire a car, pick a lock, or turn off a burglar alarm, Larceny is used. Characters also use it to set up security systems or figure out how a break-in happened. High-end security systems that feature computer controls, video surveillance, or electronic alarms might also require the Technology skill to overcome.</p>

<p><b>Example Uses:</b> <i>Hot-wiring a car requires a Dexterity + Larceny static test. Finding security measures without setting them off requires a Wits + Larceny static test. Setting up a good security system requires an Intelligence + Larceny static test. Hence, bypassing a security system requires a static challenge using the "criminals'" Wits + Larceny vs. a difficulty equal to the security creator’s Intelligence + Larceny.</i></p>

        `
    }
    if (traitname.toLowerCase() === 'melee') {
        return `
<p>This is the skill used to hit others with objects, stake another vampire, or grapple another with a rope or chain.</p>
        `
    }
    if (traitname.toLowerCase() === 'stealth') {
        return `
<p>Stealth advances actions such as going unseen in a crowd, hiding successfully in shadows, or sneaking around undetected. Stealth is often opposed by Awareness in a game of cat and mouse between spy and spycatcher.</p>

<p><b>Example Uses:</b> <i>Subtly tailing another person in a crowd requires an opposed Wits + Stealth test. 
Evading pursuit requires a Dexterity + Stealth test opposed by a pursuer’s Wits + Awareness. 
Lying hidden in wait for hours on end requires a Resolve + Stealth test opposed by the target’s 
Wits + Awareness.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'survival') {
        return `
<p>Survival governs the ability to endure difficult conditions outside of civilization and make it back safely. Skills such as making a safe shelter against the sun in the woods, noticing werewolf signs, and navigating by the stars are all governed by Survival.</p>

<p><b>Example Uses:</b> <i>Ensuring a Haven is safe against the sun requires a Wits + Survival static test. Noticing signs of interlopers in an area requires a Wits + Survival test against the opponent’s Wits + Stealth. Using a map to determine the safest routes through a rural area requires a static Intelligence + Survival test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'animal ken') {
        return `
<p>Animal Ken represents the ability to connect with animals, keep them calm, assess what might be upsetting them, and, in the case of domesticated animals, provide training. Without any dots in this Skill, most animals avoid you or are aggressive toward you.</p>

<p><b>Example Uses:</b> <i>Commanding an animal requires a Charisma + Animal Ken static challenge. Calming an aggressive animal requires a Manipulation + Animal Ken static challenge. Training an animal to perform mundane tasks without supervision requires a Composure + Animal Ken static challenge, while trying to overcome an animal’s training requires an opposed Composure + Animal Ken vs. the trainer.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'etiquette') {
        return `
<p>The Etiquette Skill allows you to follow the social conventions of a scene, change protocols, and be a pleasing presence to the people around you. This Skill is important in high society and the Camarilla.</p>

<p><b>Example Uses:</b> <i>Having an understanding of Sect’s basic social protocols requires an Intelligence + Etiquette static challenge. Knowing which utensil to use when to make a positive first impression at a business dinner party requires a Charisma + Etiquette static challenge.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'insight') {
        return `
<p>Insight grants you the ability to interpret subtle cues, body language, and other forms of social interactions. Empathic characters tend to have high Insight.</p>

<p><b>Example Uses:</b> <i>Detecting a mortal’s level of suspicion about the vampire attempting to feed on them requires a Wits + Insight test opposed by Composure + Subterfuge. Trying to calm down a crying child requires a Charisma + Insight static test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'intimidation') {
        return `
<p>The power to browbeat, bully, and scare in a social situation, Intimidation represents overpowering the will of another through social force.</p>

<p><b>Example Uses:</b> <i>Staring down an attacking gangster requires an opposed Composure + Intimidation test against their Resolve + Composure. Making a veiled threat to scare a politician into compliance requires an opposed Manipulation + Intimidation test against their Wits + Resolve. Using your physical might to intimidate someone requires an opposed Strength + Intimidation test against their Wits + Resolve.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'leadership') {
        return `
<p>Leadership training helps you successfully influence groups. Managing a group of Kindred on a research project, driving a riot in a particular direction, or rallying support in followers are all examples of Leadership Skills in action.</p>

<p><b>Example Uses:</b> <i>Encouraging the human masses of a city to vote for a particular proposition requires a Manipulation + Leadership test against the Charisma + Leadership score of the opponent with the highest Leadership score. Leading an angry mob down a side street requires a Charisma + Leadership static test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'performance') {
        return `
<p>The Performance Skill represents your overall ability to artistically perform, such as doing comedy standup, dancing, public speaking, or executing any type of arts that do not involve crafting an object (which would utilize the Crafts Skill). You might be a hilarious comedian, a fine dancer, or an astute critic of film. For each dot of Performance you possess, you may choose a particular specialty of performance artistry in which you are more accomplished. When using the Performance Skill in your specialty area, you gain +1 to your pool.</p>

<p>For example, if you have 2 dots in Performance with the specialties dancing and singing, and you are dancing with the Prince, your pool would be Dexterity + 2 for your two dots in Performance +1 for your specialty in dancing. You may only gain a single +1 bonus to your Performance pool, regardless of the number of specialties that may apply to the challenge.</p>

<p><b>Example Uses:</b> <i>Conducting the local symphony orchestra in a beautiful performance of the 1812 Overture requires an Intelligence + Performance static test. Dancing an exquisite tango requires a Dexterity + Performance static test. Performing the lead soprano’s role in Phantom of the Opera requires a Charisma + Performance test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'persuasion') {
        return `
<p>Persuasion is used to convince someone that your point of view is correct and should be followed. From making a big sale to convincing a police officer to let you off with a warning for speeding, Persuasion applies in a wide variety of situations when you need someone to change their perspective.</p>

<p><b>Example Uses:</b> <i>Convincing a police officer to let you off with a warning requires an opposed Manipulation + Persuasion test against their Wits + Resolve. Working on a legal negotiation against an opposing party over the course of a night requires an opposed Resolve + Persuasion test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'streetwise') {
        return `
<p>Streetwise represents a character’s understanding of the workings of the street, from knowing the gangs that populate an urban area to finding illicit drugs, knowing street lingo to understanding how to spot a narc.</p>

<p><b>Example Uses:</b> <i>Determining if a person is an undercover police officer requires an opposed Wits + Streetwise test against their Composure + Subterfuge. Being able to find a gun with the serial numbers filed off requires an Intelligence + Streetwise static test. Having a tense negotiation with a rival gang requires an opposed Manipulation + Streetwise test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'subterfuge') {
        return `
<p>Subterfuge is the art of the con. Whether your character is lying, telling a tall tale, or pretending to be someone they are not, this Skill represents your talent for deception and pretending to be someone or something else—including a mortal.</p>

<p><b>Example Uses:</b> <i>Coming up with a believable cover story when you are caught somewhere you should not be requires a Manipulation + Subterfuge test against your opponent’s Wits + Insight. Faking illness requires a Charisma + Subterfuge test against your opponent’s Wits + Insight.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'academics') {
        return `
<p>Academics measures your overall training and knowledge of humanities and the liberal arts. For each dot of Academics you possess, you may choose a particular specialty that represents your strongest areas of study. When using the Academics Skill in an area of study with your specialty, you gain +1 to your pool.</p>

<p>For example, if you have 2 dots in Academics with the specialties of architecture and urban planning, and you are working on developing an area of the city to serve as new feeding grounds, your pool would be your Intelligence + 2 for two dots in Academics +1 for your specialty in urban planning. You may only gain a single +1 bonus to your Academics pool, regardless of the number of specialties that may apply to the challenge.</p>

<p>For learning foreign languages, use the Linguistics Background (see page 179). Knowledge of supernatural creatures, events, and phenomenon requires an Intelligence + Occult challenge (see pages 68).</p>

<p><b>Example Uses:</b> <i>Researching in a library for the schematics for an old building in town requires an Intelligence + Academics static test. Recalling on the fly a key detail about medieval history requires a Wits + Academics static test. Winning an academic debate requires an opposed Charisma + Academics test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'awareness') {
        return `
<p>Awareness measures how perceptive a character is. They may be able to see a hidden item, spot an improvised trap hidden in a wall, smell a faint hint of gasoline, or detect someone sneaking up on them. A character’s Initiative score is measured by Composure + Awareness.</p>

<p><b>Example Uses:</b> <i>Spotting a trap hidden in a wall requires an opposed Wits + Awareness against the trap-layer’s Dexterity + Crafts. Detecting a car following you requires an opposed Wits + Awareness against the driver’s Wits + Driving. Staying focused on a long stake-out to spot someone trying to sneak out of a room requires an opposed Resolve + Awareness against your opponent’s Dexterity + Stealth.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'finance') {
        return `
<p>The Finance Skill represents the ability to root through financial documents and receipts for clues, appraise rare items, invest money effectively, and plan for stock market shifts to your advantage (or disadvantage, if you wish to feed someone bad information).</p>

<p><b>Example Uses:</b> <i>Auditing a business’s cooked books for the tiny revealing discrepancies requires an opposed Resolve + Finance vs. the opponent’s Intelligence + Finance. Understanding subtle hints suggesting an impending fall in the stock market and how to manipulate that to your advantage requires a Wits + Finance static test. Cooking the books convincingly requires an Intelligence + Finance test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'investigation') {
        return `
<p>Investigation allows you to find clues and uncover truths behind mysteries. From tracing a hiding mortal who witnessed a Masquerade breach to finding subtle hints at a murder scene, Investigation is a very useful Skill for vampires.</p>

<p><b>Example Uses:</b> <i>Investigating a murder scene for clues requires a Wits + Investigation test. Rooting for hours through a warehouse to find a missing document requires a Resolve + Investigation test. Investigation tests may be static if clues are not concealed by an opponent; if actively concealed, test against the opponent’s Intelligence + Larceny, at the Storyteller’s discretion.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'medicine') {
        return `
<p>Medicine allows you to identify illnesses and disease, understand the cause of sickness or death, and determine clues from examining mortal bodies. Medicine also allows you to know what drugs to use for ailments, how to use medical equipment correctly, and how to perform first aid. Characters can use Medicine to accelerate healing in mortals (see Healing, page 99).</p>

<p><b>Example Uses:</b> <i>Doing first aid on a mortal who is bleeding out requires a Wits + Medicine static test. Performing an exhaustive autopsy to find a key clue requires a Resolve + Medicine test, which may be static or opposed by someone who attempted to hide the evidence. Doing medical research to determine an obscure cause of death requires an Intelligence + Medicine static test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'occult') {
        return `
<p>Occult represents an understanding of the esoteric, from the beliefs of obscure cults to the practices of secret societies. You can recognize mystical sigils, do paranormal research, and understand the legends of vampiric society.</p>

<p><b>Example Uses:</b> <i>Researching the meaning of occult symbology used by a cult to understand their belief system requires an Intelligence + Occult static test. Remembering a key detail about your clan’s history requires a Wits + Occult static test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'politics') {
        return `
<p>The Politics Skill helps you navigate bureaucracy and understand how things get done in organizations. Whether you want to understand the basics of vampiric politics, remember which Sect runs which city, put pressure on a politician, or be able to cut through a mortal government’s red tape, the Politics Skill is useful.</p>

<p><b>Example Uses:</b> <i>Knowing a character’s Status Monikers requires an Intelligence + Politics static test (see Monikers, page 311). Researching the political connections of a mayoral candidate you want to undermine requires a Resolve + Politics static test. Remembering under pressure who is publicly in conflict with whom in your Domain requires a Wits + Politics static test. Maneuvering through political red tape at city hall requires a Manipulation + Politics test against your opponent’s Wits + Politics.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'science') {
        return `
<p>This Skill represents understanding the many areas of mortal scientific knowledge. Smart vampires know that much can be learned from studying the building blocks of life. For each dot of Science you possess, you may choose a particular specialty that represents your strongest areas of study. When using the Science Skill in an area of study with your specialty, you gain +1 to your pool.</p>

<p>For example, if you have 2 dots in Science with the specialties of chemistry and math, and you are trying to solve a complex math problem, your pool would be your Intelligence + 2 for two dots in Science +1 for your specialty in mathematics. You may only gain a single +1 bonus to your Science pool, regardless of the number of specialties that may apply to the challenge.</p>

<p>This Skill also governs your skill with laboratory equipment.</p>

<p><b>Example Uses:</b> <i>Using a laboratory to assess a strange compound found at a crime scene requires an Intelligence + Science static test. Remembering the specific smell of nitroglycerine about to explode requires a Wits + Science static test. Creating a plan for a new building requires an Intelligence + Science test.</i></p>
        `
    }
    if (traitname.toLowerCase() === 'technology') {
        return `
<p>The Technology Skill is utilized to understand how to use the technical developments that most vampires would find difficult to comprehend. In modern nights, Technology provides an understanding of things such as computer systems, advanced electronic security, drones, and FIRSTLIGHT thermal scanners.</p>

<p><b>Example Uses:</b> <i>Piloting a drone through an underground tunnel requires a Dexterity + Technology static test. Hacking into a defended computer system requires an opposed Intelligence + Technology against the opponent’s Intelligence + Technology. Disarming a bomb requires a Composure + Technology test against the creator’s Intelligence + Crafts.</i></p>
        `
    }

    return '_No description available._'
}

