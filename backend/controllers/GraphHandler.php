<?php
defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;

class GraphHandler extends AbstractController
{
    public $dao = null;
    public $resource = null;

    public function __construct($app, $_smsEntriesDAO, $resource)
    {
        $this->dao = $_smsEntriesDAO;
        $this->resource = $resource;

        parent::__construct($app);
    }

    public function logCronCall($message)
    {
        return function () use ($message) {
            $date = $this->resource->getDateTime();
            $filename = LOGS_DIR . DIR_SEP . LOG_PREFIX . "_logins-" . $date->format("Y-m") . ".txt";
            $fileData = $date->format("Y-m-d G:i:s") . "\t" . getenv("REMOTE_ADDR") . "\t";
            $fileData .= $message . "\n";
            $this->resource->writeFile($filename, $fileData);

            $userId = $this->app->userId;
            $targetDay = $date;

            $entries = $this->dao->getSameDayEntries($userId, $targetDay);

            $printedNonWeight = array_reduce($entries, "printEntrys");

            $weekNumber =  idate('W', time());
            $virtueLength = sizeof($this->VIRTUES);
            $modulo = $weekNumber % $virtueLength;
            $text = $this->VIRTUES[$modulo];
            $additions = '<strong>Virtue:</strong> ' . $text . "<br><br>";

            $dayNumber =  idate('z', time());
            $mantraLength = sizeof($this->MANTRAS);
            $modulo = $dayNumber % $mantraLength;
            $text = $this->MANTRAS[$modulo];
            $additions .= '<strong>Mantra of the Day:</strong> ' . $text . "<br><br>";

            $qLength = sizeof($this->QUESTIONOTDAY);
            $modulo = $dayNumber % $qLength;
            $text = $this->QUESTIONOTDAY[$modulo];
            $link = "https://" . $_ENV['DOMAIN'] . "/" . $_ENV['ROOT_URL'] . "/oneDay?pretext=#qod";
            $additions .= "<strong><a href=\"" . $link . "\">Question of the Day:</a></strong>"
                . $text . "<br><br>";

            $message = "<HTML><BODY><ul>" . $printedNonWeight . "</ul>" .
                $additions . "</BODY></HTML>";

            $subject = "On this day " . $targetDay->format('M d');
            $to = $_ENV['MY_EMAIL'];

            $headers = "From: miniblog@lilplaytime.com\r\n";
            $headers .= "Reply-To: " . $_ENV['MY_EMAIL'] . "\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion();
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
            echo $message;
            mail($to, $subject, $message, $headers);
            echo "{ \"cron\":\"email\"}";
        };
    }

    public function groupByYearMonth($carry, $item)
    {
        $year = substr($item['date'], 0, 4);
        $month = substr($item['date'], 5, 2);
        if (!isset($carry[$year . '-' . $month])) {
            $carry[$year . '-' . $month] = [];
        }
        array_push($carry[$year . '-' . $month], $item['weight']);
        return $carry;
    }
    public $VIRTUES =  array(
        '1. Temperance: Eat not to dullness; drink not to elevation. ',
        '2. Silence: Speak not but what may benefit others or yourself; avoid trifling conversation. ',
        '3. Order: Let all your things have their places; let each part of your business have its time. ',
        '4. Resolution: Resolve to perform what you ought; perform without fail what you resolve. ',
        '5. Frugality: Make no expense but to do good to others or yourself; i.e., waste nothing. ',
        '6. Industry: Lose no time; be always employed in something useful; cut off all unnecessary actions. ',
        '7. Sincerity: Use no hurtful deceit; think innocently and justly, and, if you speak, speak accordingly. ',
        '8. Justice: Wrong none by doing injuries, or omitting the benefits that are your duty. ',
        '9. Moderation: Avoid extremes; forbear resenting injuries so much as you think they deserve. ',
        '10. Cleanliness: Tolerate no uncleanliness in body, clothes, or habitation. ',
        '11. Tranquillity: Be not disturbed at trifles, or at accidents common or unavoidable. ',
        '12. Chastity: Rarely use venery but for health or offspring, never to dullness, weakness, or the injury of your own or another\'s peace or reputation. ',
        '13. Humility: Imitate Jesus and Socrates. '
    );

    public $MANTRAS =  array(
        'Determination - “In the heart of the strong shines a relentless ray of resolve... It cannot be stopped, it cannot be controlled, and it will not fail.”',
        'Don\'t be afraid of your dreams',
        'Be more optimistic for more productivity',
        'Love should be authentic. Real, unconditional',
        'Be humble, work hard. Put your back against the wall and move forward',
        'the only easy day was yesterday #persevere',
        'Keep loses in perspective, fail forward = reflect on what can be improved',
        'Set a goal, ready, aim, fire, next',
        'Don\'t wait to try new things, spend time on things that matter',
        'Clear: Mind Like Water',
        'make it up, make it Happen',
        'Set your goals; Play the part',
        'Make it easy on yourself; Make it matter',
        'Do it, Do it Right, Do it Right Now',
        'You teach people how to treat you',
        '**Know your calling**',
        '**Take responsibility for the energy you put out**',
        'The present is the greatest gift',
        'Progress not perfection',
        'Productivity => producing',
        'Influence comes from trust, proximity, admiration, believe to care for them',
        'Public speaking/persuasion requires presence, clarity, distinction between old/new argument',
        'Not dead, can’t quit',
        'Learn at all times at all costs',
        "Be consistent in your beliefs of what you truly value.",
        "Getting better is the goal, every problem is a chance to get better",
        "Small daily change",
        "Do work based on our beliefs",
        "Instead of do what makes you happy, do what make you great",
        "Live Life, Give Love, Make a difference",
        "If I am not using it don\'t need it",
        "Get there, believe",
        "Results, not excuses",
        "Only i am stopping me from being successful",
        "A man reveals his character even in the simplest things he does",
        "a year from now you'll wish you had started today",
        "one day at a time, no regrets and move on"
    );

    public $QUESTIONOTDAY =  array(
        "What is in your heart? What is your passion?",

        "What do you wish you had more time to do?",
        "What do you think you spend too much time doing?",
        "Who do you need to get in touch with because it 's been too long?",
        "What is something new you recently tried and enjoyed?",
        "What will you have wanted to accomplish by the time you are 100?",
        "Describe something you achieved that you didn 't think was possible.",
        "What gives you hope?",
        "What is a new habit you want to take up?",
        "What life advice would you offer to a newborn infant?",
        "When did you last cry...alone...in front of someone else?",
        "What matters to you and why?",
        "What holds you back from doing the things you really want to do?",
        "What is your greatest fear?",
        "What is your greatest accomplishment?",
        "What is something you know you do differently than most people?",
        "What is your next great adventure?",
        "What 's one thing that could happen today that would make it great?",
        "What inspires you?",
        "What are the little things you stop to appreciate and enjoy?",
        "What does home mean to you?",
        "What do you want to do before you die?",
        "How do you show your love?",

        "How do I feel at the moment?",
        "What do I need more of in my life?",
        "What would make me happy right now?",
        "What is going right in my life?",
        "What am I grateful for?",
        "When did I experience joy this week?",
        "List all my small victories and successes.",
        "What's bothering me? Why?",
        "What are my priorities at the moment?",
        "What do I love about myself?",
        "Who means the world to me and why?",
        "If I could share one message with the world, what would it be?",
        "What advice would I give to my younger self? (Do I follow this advice now?)",
        "What lesson did I learn this week?",
        "If I had all the time in the world, what would I want to do first?",
        "What's draining my energy? How can I reduce or cut it out?",
        "What does my ideal morning look like?",
        "What does my ideal day look like?",
        "What makes me come alive? When was the last time I felt truly alive?",
        "What/Who inspires me the most? Why am I drawn to those inspirations?",
        "Where does my pain originate? What would need to happen for me to heal?",
        "What are my strengths? What am I really good at?",
        "What is something I\'ve always wanted to do but was too scared?",
        "What is something I would love to learn?",
        "What hobbies would I like to try?",
        "Where would I want to live my ideal life?",
        "Where would I like to travel in the next 5 years?",
        "What can I do to take better care of myself?",
        "When have I done something that I thought I couldn't do?",
        "At the end of my life, what do I want my legacy to be?"
    );
}


function printEntrys($carry, $item)
{
    $entryDay = new DateTime($item['date']);
    $urlPrefix = "https://" . $_ENV['DOMAIN'] . "/" . $_ENV['ROOT_URL'];
    $link = "{$urlPrefix}/index.html?date={$entryDay->format('Y-m-d')}";
    $pattern = '/(!\[[\w\ ]*\]\(\.\.\/uploads)(\/[\w\-\/\.]*)\)/';
    $replacement = "<img src=\"{$urlPrefix}uploads" . '${2}' . "\">";
    $preparedContent = preg_replace($pattern, $replacement, $item['content']);

    //replace the icons as well
    $pattern = '/<i class="fa[sb]? fa-([\w\-]*)"(><\/i>|\s?\/>)/';
    $replacement = '&lt;${1}&gt; :';
    $preparedContent = preg_replace($pattern, $replacement, $preparedContent);

    $message =  "<li><strong><a href=\"" . $link . "\">" . $entryDay->format('Y-D') . '</a>:</strong> ' . $preparedContent . "</li>";
    return $carry .= $message;
}
