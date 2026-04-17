<?php

declare(strict_types=1);

/*
 * @copyright  trilobit GmbH
 * @author     trilobit GmbH <https://github.com/trilobit-gmbh>
 * @license    LGPL-3.0-or-later
 */

namespace Trilobit\AjaxPaginationBundle\ContaoManager;

use Contao\ContaoCommentsBundle\ContaoCommentsBundle;
use Contao\ContaoNewsBundle\ContaoNewsBundle;
use Contao\CoreBundle\ContaoCoreBundle;
use Contao\ManagerPlugin\Bundle\BundlePluginInterface;
use Contao\ManagerPlugin\Bundle\Config\BundleConfig;
use Contao\ManagerPlugin\Bundle\Parser\ParserInterface;
use Trilobit\AjaxPaginationBundle\TrilobitAjaxPaginationBundle;
use Trilobit\NewsaddonsBundle\TrilobitNewsaddonsBundle;

class Plugin implements BundlePluginInterface
{
    public function getBundles(ParserInterface $parser)
    {
        return [
            BundleConfig::create(TrilobitAjaxPaginationBundle::class)
                ->setLoadAfter([
                    ContaoCoreBundle::class,
                    ContaoNewsBundle::class,
                    ContaoCommentsBundle::class,
                    TrilobitNewsaddonsBundle::class,
                ]),
        ];
    }
}
