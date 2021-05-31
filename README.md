Ajaxpagination Bundle
=====================

Das Ajaxpagination Bundle bietet ihnen die Möglichkeit die Paginierung ihrer Seite via Ajax-Request zu implementieren. Dafür müssen Sie die entsprechenden Templates mit einem Hilfscontainer versehen. Die Erweiterung kommt bereits mit einer Anzahl an Templates, die direkt verwendet werden können. 

---

The Ajaxpagination Bundle offers you the possibility to implement the pagination of your page via Ajax-Request. To do this, you have to provide the appropriate templates with an auxiliary container. The extension already comes with a number of templates which can be used directly.


Aufbau Template
---------------
```
<?php $this->extend('block_unsearchable'); ?>

<?php $this->block('content'); ?>

  <div data-pagination="page_x<?= $this->id ?>">
    <?= $this->data ?>
    <?= $this->pagination ?>
  </div>

<?php $this->endblock(); ?>
```
Template mit Hilfscontainer / Template with auxiliary container

Enthaltene Templates
--------------------
(überschreiben die entsprechenden Core-Templates)
- cal_default
- cal_mini
- ce_comments
- ce_gallery
- mod_eventlist
- mod_newslist
- mod_search

Eigene / Neue Erweiterungen mit der Ajaxpagination nachrüsten
-------------------------------------------------------------
- Die Paginierungs-Links müssen in einem NAV-Container mit der (auch Teil-) Klasse `pagination` liegen.
- Die zu paginierenden Inhalte sowie die Paginierung selbst müssen in einem Hilfscontainer liegen. 
- ```
  <div data-pagination="...">
      ...
  </div>
  ```
- Dieser Hilfscontainer benötigt eine eindeutige Kennung. Hier bietet sich die ID des verwendeten Elements mit einem Prefix an `page_xyz<?php echo $this->id; ?>` (Im Bundle wird das Muster des Parameternamen aus dem Paginierungs-Link verwendet).


Installation
------------
- Installation der Erweiterung via composer: [trilobit-gmbh/contao-ajaxpagination-bundle](https://packagist.org/packages/trilobit-gmbh/contao-ajaxpagination-bundle).
- Um die Installation abzuschließen bitte noch in den fraglichen `Themes > Seitenlayouts` unter `jQuery laden` die Option `j_ajax-pagination` aktivieren. 



Konfiguration
-------------

In den Templates kann jetzt im umgebenden Container ergänzend die Transparenz definiert werden (die beim Nachladen gesetzt wird) sowie der Arbeitsmodus umgeschaltet werden (von "ersetzen" zu "anhängen")

```
<div data-pagination="..." data-pagination-type="add" data-pagination-opacity=".25">
    ...
</div>
```
Ohne das jeweilige Attribut `data-pagination-type="add"` bzw `data-pagination-opacity=".25"` arbeitet die Paginierung wie bisher auch.

Compatibility
-------------

- Contao version ~4.4
- Contao version ~4.9